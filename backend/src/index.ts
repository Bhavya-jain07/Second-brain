import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import multer from "multer";
import { ContentModel, LinkModel, UserModel, CONTENT_TYPES } from "./db";
import { embedText, cosineSimilarity } from "./embeddings";
import { JWT_SECRET, PORT, CLIENT_URL } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./utils";

const app = express();

// Render (and most hosts) sit behind a reverse proxy, so the app needs to
// trust the X-Forwarded-For header to know the real client IP. Without
// this, express-rate-limit throws on every request in production.
app.set("trust proxy", 1);

app.use(express.json());
app.use(cors({ origin: CLIENT_URL }));

// Basic brute-force protection: caps repeated signup/signin/password-reset
// attempts from the same IP. Doesn't affect normal usage.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});

const credentialsSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const contentSchema = z.object({
  link: z.string().url("Link must be a valid URL"),
  type: z.enum(CONTENT_TYPES),
  title: z.string().min(1).max(200),
  thumbnail: z.string().url().optional(),
});

// Files are stored as base64 directly in MongoDB (no external storage
// service needed) — kept well under Mongo's 16MB document limit once
// base64-encoded (base64 adds ~33% size overhead).
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
});

// All fields optional here — tags/note/pin are added later by editing a
// saved item, never required at the moment something is added.
const contentPatchSchema = z.object({
  tags: z.array(z.string().min(1).max(30)).max(10).optional(),
  note: z.string().max(300).optional(),
  pinned: z.boolean().optional(),
});

const forgotPasswordSchema = z.object({
  username: z.string().min(3),
});

const resetPasswordSchema = z.object({
  token: z.string().min(10),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

// ---------- Auth ----------

app.post("/api/v1/signup", authLimiter, async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }
  const { username, password } = parsed.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create({ username, password: hashedPassword });
    res.status(201).json({ message: "User signed up" });
  } catch (e: any) {
    if (e?.code === 11000) {
      // Duplicate key error — this username is genuinely taken.
      res.status(409).json({ message: "User already exists" });
      return;
    }
    // Anything else (DB connection hiccup, etc.) — log it so it's visible
    // in the server logs, and tell the client the truth instead of
    // guessing it was a duplicate username.
    console.error("Signup error:", e);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

app.post("/api/v1/signin", authLimiter, async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }
  const { username, password } = parsed.data;

  const existingUser = await UserModel.findOne({ username });
  if (!existingUser) {
    res.status(403).json({ message: "Incorrect credentials" });
    return;
  }

  const passwordMatches = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatches) {
    res.status(403).json({ message: "Incorrect credentials" });
    return;
  }

  const token = jwt.sign({ id: existingUser._id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, username: existingUser.username });
});

app.post("/api/v1/forgot-password", authLimiter, async (req, res) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }
  const { username } = parsed.data;

  const user = await UserModel.findOne({ username });

  // Always respond the same way whether or not the account exists, so this
  // endpoint can't be used to check which usernames are registered.
  const genericResponse = { message: "If that account exists, a reset code has been generated." };

  if (!user) {
    res.json(genericResponse);
    return;
  }

  const resetToken = random(24);
  user.resetToken = resetToken;
  user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  await user.save();

  // NOTE: this project has no email service wired up, so the token is
  // returned directly here for demo purposes. In production, email this
  // token/link to the user instead of sending it back in the response.
  res.json({ ...genericResponse, devResetToken: resetToken });
});

app.post("/api/v1/reset-password", authLimiter, async (req, res) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }
  const { token, newPassword } = parsed.data;

  const user = await UserModel.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    res.status(400).json({ message: "This reset code is invalid or has expired." });
    return;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ message: "Password updated. You can now sign in." });
});

// ---------- Content ----------

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const parsed = contentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }
  const { link, type, title, thumbnail } = parsed.data;

  const content = await ContentModel.create({
    link,
    type,
    title,
    thumbnail,
    userId: req.userId,
  });

  // Best-effort: generate a local embedding for semantic search. If this
  // fails for any reason (model still loading, etc.), the content is
  // already saved — it just won't show up in semantic search results.
  try {
    const embedding = await embedText(title);
    content.set("embedding", embedding);
    await content.save();
  } catch (e) {
    console.error("Embedding error (non-fatal):", e);
  }

  res.status(201).json({ message: "Content added", content });
});

app.post("/api/v1/content/upload", userMiddleware, (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.status(413).json({ message: "File is too large — max size is 8MB." });
        return;
      }
      res.status(400).json({ message: "Upload failed: " + err.message });
      return;
    }
    if (err) {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Something went wrong uploading that file." });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: "No file was uploaded." });
      return;
    }

    try {
      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const content = await ContentModel.create({
        title: req.file.originalname,
        link: dataUri,
        type: "file",
        fileName: req.file.originalname,
        fileMimeType: req.file.mimetype,
        fileSize: req.file.size,
        userId: req.userId,
      });

      try {
        const embedding = await embedText(req.file.originalname);
        content.set("embedding", embedding);
        await content.save();
      } catch (e) {
        console.error("Embedding error (non-fatal):", e);
      }

      res.status(201).json({ message: "File added", content });
    } catch (e) {
      console.error("File save error:", e);
      res.status(500).json({ message: "Something went wrong saving that file." });
    }
  });
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  const content = await ContentModel.find({ userId: req.userId }).sort({ pinned: -1, createdAt: -1 });
  res.json({ content });
});

const semanticSearchSchema = z.object({
  query: z.string().min(1).max(200),
});

// Semantic search: embeds the query locally (same free model used when
// content is saved) and ranks the user's items by cosine similarity.
// Lighter rate limit than auth routes since each call costs real CPU time
// on the server (running the embedding model), even though it costs $0.
const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many searches. Please slow down a little." },
});

app.post("/api/v1/content/search", userMiddleware, searchLimiter, async (req, res) => {
  const parsed = semanticSearchSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }

  try {
    const queryEmbedding = await embedText(parsed.data.query);

    // +select("+embedding") because the field is excluded by default.
    const items = await ContentModel.find({ userId: req.userId }).select("+embedding");

    const ranked = items
      .filter((item) => Array.isArray(item.get("embedding")) && item.get("embedding").length > 0)
      .map((item) => ({
        item,
        score: cosineSimilarity(queryEmbedding, item.get("embedding") as number[]),
      }))
      .sort((a, b) => b.score - a.score)
      .filter((r) => r.score > 0.2) // drop weak/irrelevant matches
      .slice(0, 20)
      .map((r) => ({ ...r.item.toJSON(), score: r.score }));

    res.json({ content: ranked });
  } catch (e) {
    console.error("Semantic search error:", e);
    res.status(500).json({ message: "Search is warming up — try again in a few seconds." });
  }
});

// Optional edit — add tags/a note, or pin an item, any time after it was
// saved. Nothing here is required when content is first added.
app.patch("/api/v1/content/:contentId", userMiddleware, async (req, res) => {
  const contentId = String(req.params.contentId);

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    res.status(400).json({ message: "Invalid content id" });
    return;
  }

  const parsed = contentPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }

  const content = await ContentModel.findOneAndUpdate(
    { _id: contentId, userId: req.userId },
    { $set: parsed.data },
    { new: true }
  );

  if (!content) {
    res.status(404).json({ message: "Content not found" });
    return;
  }

  // If a note was added/changed, re-embed using title+note together so
  // semantic search can also match on whatever context the user added.
  if (parsed.data.note !== undefined) {
    try {
      const embedding = await embedText(`${content.title}. ${parsed.data.note}`);
      content.set("embedding", embedding);
      await content.save();
    } catch (e) {
      console.error("Embedding error (non-fatal):", e);
    }
  }

  res.json({ message: "Updated", content });
});

app.delete("/api/v1/content/:contentId", userMiddleware, async (req, res) => {
  const contentId = String(req.params.contentId);

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    res.status(400).json({ message: "Invalid content id" });
    return;
  }

  const result = await ContentModel.deleteOne({ _id: contentId, userId: req.userId });
  if (result.deletedCount === 0) {
    res.status(404).json({ message: "Content not found" });
    return;
  }

  res.json({ message: "Deleted" });
});

// ---------- Sharing ----------

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const share = Boolean(req.body.share);

  if (share) {
    const existingLink = await LinkModel.findOne({ userId: req.userId });
    if (existingLink) {
      res.json({ hash: existingLink.hash });
      return;
    }
    const hash = random(10);
    await LinkModel.create({ userId: req.userId, hash });
    res.json({ hash });
  } else {
    await LinkModel.deleteOne({ userId: req.userId });
    res.json({ message: "Removed link" });
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const { shareLink } = req.params;

  const link = await LinkModel.findOne({ hash: shareLink });
  if (!link) {
    res.status(404).json({ message: "Sorry, this share link doesn't exist" });
    return;
  }

  const [user, content] = await Promise.all([
    UserModel.findById(link.userId),
    ContentModel.find({ userId: link.userId }).sort({ createdAt: -1 }),
  ]);

  if (!user) {
    res.status(404).json({ message: "This brain no longer exists" });
    return;
  }

  res.json({ username: user.username, content });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
