import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { BrainIcon } from "../components/Icons";
import { useToast, friendlyError } from "../components/Toast";

export function ForgotPassword() {
  const [step, setStep] = useState<"request" | "reset">("request");
  const [username, setUsername] = useState("");
  const [devToken, setDevToken] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function requestCode(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/forgot-password", { username });
      if (res.data.devResetToken) {
        // No email service is wired up in this project, so the code is
        // handed back directly for demo purposes — see the note below.
        setDevToken(res.data.devResetToken);
        setToken(res.data.devResetToken);
      }
      setStep("reset");
    } catch (err: any) {
      showToast(friendlyError(err), "error");
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/reset-password", { token, newPassword });
      showToast("Password updated — sign in with your new password");
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

        {step === "request" ? (
          <>
            <h1 className="text-xl font-semibold text-zinc-800 mb-1">Reset your password</h1>
            <p className="text-sm text-zinc-500 mb-6">Enter your username and we'll generate a reset code.</p>

            <form onSubmit={requestCode} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-700">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-brand-700 disabled:opacity-50 transition"
              >
                {loading ? "Sending…" : "Send reset code"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-zinc-800 mb-1">Set a new password</h1>
            <p className="text-sm text-zinc-500 mb-4">
              {devToken
                ? "This project has no email service connected, so the reset code is shown here directly for testing."
                : "Enter the reset code and your new password."}
            </p>

            {devToken && (
              <div className="mb-4 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2 text-xs text-brand-700 font-mono break-all">
                {devToken}
              </div>
            )}

            <form onSubmit={resetPassword} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-700">Reset code</label>
                <input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500 font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">New password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                {loading ? "Updating…" : "Update password"}
              </button>
            </form>
          </>
        )}

        <p className="text-sm text-zinc-500 mt-6 text-center">
          <Link to="/signin" className="text-brand-600 font-medium hover:text-brand-700">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
