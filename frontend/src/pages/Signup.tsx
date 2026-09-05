import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { BrainIcon } from "../components/Icons";
import { useToast, friendlyError } from "../components/Toast";

export function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/signup", { username, password });
      showToast("Account created — sign in to continue");
      navigate("/signin");
    } catch (err: any) {
      showToast(friendlyError(err), "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm bg-white border border-zinc-100 rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-2 mb-6 text-zinc-800 font-semibold text-lg">
          <BrainIcon className="w-6 h-6 text-brand-600" />
          Second Brain
        </div>

        <h1 className="text-xl font-semibold text-zinc-800 mb-1">Create an account</h1>
        <p className="text-sm text-zinc-500 mb-6">Start saving what matters, in one place.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-700">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder="e.g. bhavya"
              required
              minLength={3}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-brand-700 disabled:opacity-50 transition"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="text-sm text-zinc-500 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/signin" className="text-brand-600 font-medium hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
