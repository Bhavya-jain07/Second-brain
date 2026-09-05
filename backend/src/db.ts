import mongoose, { model, Schema } from "mongoose";
import { MONGO_URL } from "./config";

mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // stored as a bcrypt hash, never plain text
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});

export const UserModel = model("User", UserSchema);

// "youtube" and "twitter" are auto-detected from the pasted/dropped link.
// "other" is a generic fallback for any link that doesn't match a known pattern.
export const CONTENT_TYPES = ["youtube", "twitter", "other"] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

const ContentSchema = new Schema(
  {
    title: { type: String, required: true },
    link: { type: String, required: true },
    type: { type: String, enum: CONTENT_TYPES, required: true },
    thumbnail: { type: String }, // image URL, only set for youtube links
    tags: { type: [String], default: [] }, // optional, added later by the user
    note: { type: String }, // optional short note, added later by the user
    pinned: { type: Boolean, default: false },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

export const ContentModel = model("Content", ContentSchema);

const LinkSchema = new Schema({
  hash: { type: String, required: true, unique: true },
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true, unique: true },
});

export const LinkModel = model("Link", LinkSchema);
