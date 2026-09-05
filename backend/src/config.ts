import dotenv from "dotenv";
dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env var: ${name}. Did you copy .env.example to .env?`);
  }
  return value;
}

export const MONGO_URL = required("MONGO_URL", "mongodb://localhost:27017/second-brain");
export const JWT_SECRET = required("JWT_SECRET", "dev-only-secret-change-me");
export const PORT = Number(process.env.PORT ?? 3000);
export const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:5173";
