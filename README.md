# Second Brain

Full-stack app to save YouTube videos, tweets, and links in one place —
drag-and-drop to add, thumbnails auto-generated, and a public read-only
share view for your whole "brain".

- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), JWT auth, bcrypt, Zod validation
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, React Router

## Design

Two deliberately different visual languages, split by purpose:

- **Signup / Signin / Forgot-password** — a hand-generated pixel-art sunset
  scene (`frontend/public/auth-bg.png`, made procedurally with Python/Pillow)
  behind a retro glass panel, "Press Start 2P" + "VT323" fonts, a
  password show/hide toggle, and Google/GitHub buttons. The OAuth buttons
  are UI-only for now — clicking shows a toast, since real OAuth needs a
  backend integration (Google Cloud credentials, Passport.js or similar)
  that hasn't been wired up yet.
- **Dashboard / shared-brain view** — a Swiss / International Typographic
  Style layout: bold black grid lines, one red accent color, numbered
  cards, no gradients or shadows, cards invert to black on hover. Colors
  live in `frontend/tailwind.config.js` under the `swiss` token group.

## Features

- Signup / signin with hashed passwords (bcrypt) and JWT sessions
- Forgot/reset password flow (no email service wired up — the reset code
  is returned directly in the API response for demo purposes; swap in
  a real email step in `backend/src/index.ts` for production)
- Rate limiting on signup/signin/password-reset (basic brute-force protection)
- Drag any link onto the dashboard (or paste it) to save it — YouTube and
  tweet links are auto-detected, with real thumbnails/titles pulled from
  YouTube's and Twitter's public oEmbed APIs (no API keys needed)
- Search bar to filter your saved content by title or link
- Sort by newest/oldest
- Filter saved items by type (videos / tweets / links) from the sidebar
- Copy-link button and delete on each card
- Toast notifications for save/delete/errors, with friendlier error messages
- Skeleton loading state while content is fetching
- Optional per-item extras (never required when you add something) — pin to
  top, free-text tags, and a short note, all editable via the pencil icon
  on a card
- Upload files and PDFs directly — drag a file from your computer, or use
  the paperclip button. Stored as base64 in MongoDB (max 8MB per file, no
  external storage service needed)
- Bulk add — paste several links at once (one per line)
- Search also matches tags, not just title/link
- Mobile view: sidebar becomes a bottom tab bar on small screens
- Press `/` anywhere to jump to the quick-add input
- "Share Brain" generates a public link — anyone with it sees a read-only
  view of everything you've saved, no login required

## Project structure

```
second-brain/
  backend/     Express + MongoDB API
  frontend/    React + Vite app
```

## Running it locally

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URL` — your MongoDB connection string. Easiest option: a free
  [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster, or
  run MongoDB locally (`mongodb://localhost:27017/second-brain`).
- `JWT_SECRET` — any long random string.
- `PORT` — defaults to 3000.
- `CLIENT_URL` — defaults to `http://localhost:5173` (used for CORS).

Then:

```bash
npm run dev
```

Server starts on `http://localhost:3000`.

### 2. Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Opens on `http://localhost:5173`. If your backend runs somewhere other than
`localhost:3000`, copy `.env.example` to `.env` and set `VITE_API_URL` to
your backend's URL (see the deployment section below for the production
equivalent of this).

### 3. Use it

1. Go to `http://localhost:5173/signup`, create an account, sign in.
2. Drag a YouTube or tweet link into the app (or paste it in the bar at the
   top and hit Add).
3. Click **Share Brain** to get a public link others can open to view your
   saved content, read-only.

## Notes on the drag-and-drop / thumbnails

- Dragging works with anything the browser exposes as a URL when dragged —
  a browser tab, a link on a webpage, or selected link text.
- Thumbnails/titles are fetched **client-side** from YouTube's and
  Twitter's public oEmbed endpoints when you add a link — this needs
  internet access in the browser running the app (this is normal once
  you're running it on your own machine or deployed; it just isn't
  reachable from within the sandbox this was built in).
- Any other link is saved as a generic "link" card.

## Deploying (GitHub → Render + Vercel)

This is the easiest free path: push this repo to GitHub, deploy the
backend on **Render**, and the frontend on **Vercel** (Netlify works the
same way). Do these steps in order.

### 1. Push to GitHub

```bash
cd second-brain
git init
git add .
git commit -m "Second Brain"
```
Create a new repo on GitHub, then:
```bash
git remote add origin https://github.com/<you>/second-brain.git
git branch -M main
git push -u origin main
```

### 2. Set up MongoDB Atlas (free)

1. Create a free cluster at https://www.mongodb.com/cloud/atlas/register
2. Database Access → add a user with a password.
3. Network Access → add IP `0.0.0.0/0` (allow from anywhere — fine for a
   personal project like this).
4. Get your connection string (Connect → Drivers) — looks like
   `mongodb+srv://user:password@cluster.mongodb.net/second-brain`.

### 3. Deploy the backend on Render

1. https://render.com → New → Web Service → connect your GitHub repo.
2. **Root directory:** `backend`
3. **Build command:** `npm install && npm run build`
4. **Start command:** `npm start`
5. Add environment variables (Render dashboard → Environment):
   - `MONGO_URL` — your Atlas connection string from step 2
   - `JWT_SECRET` — any long random string (e.g. generate one with
     `openssl rand -base64 32`)
   - `CLIENT_URL` — leave a placeholder for now (e.g.
     `http://localhost:5173`), you'll update it in step 5
6. Deploy. Note the URL Render gives you, e.g.
   `https://second-brain-api.onrender.com`.

### 4. Deploy the frontend on Vercel

1. https://vercel.com → New Project → import the same GitHub repo.
2. **Root directory:** `frontend`
3. Framework preset: Vite (auto-detected).
4. Add environment variable:
   - `VITE_API_URL` = `https://second-brain-api.onrender.com/api/v1`
     (your Render URL from step 3, with `/api/v1` on the end)
5. Deploy. Note the URL Vercel gives you, e.g.
   `https://second-brain.vercel.app`.

### 5. Connect the two

Go back to Render → your backend service → Environment → update
`CLIENT_URL` to your actual Vercel URL from step 4 (no trailing slash),
e.g. `https://second-brain.vercel.app`. Save — Render redeploys
automatically. This is required for CORS; without it the deployed
frontend can't call the deployed backend.

### 6. Test it

Open your Vercel URL, sign up, add a link, and try **Share Brain** — the
generated link will now be a real `https://second-brain.vercel.app/share/...`
URL anyone can open.

### Notes

- Free Render web services spin down after inactivity, so the first
  request after a while takes a few seconds to wake up — normal for the
  free tier.
- If you push more commits, both Render and Vercel auto-redeploy from
  GitHub.
- Rotate `JWT_SECRET` if it's ever exposed; anyone with it can forge
  login tokens.
