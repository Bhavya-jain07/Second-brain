import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useToast, friendlyError } from "../components/Toast";
import { AuthLayout } from "../components/AuthLayout";
import { PixelField, PixelPasswordField } from "../components/PixelField";

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
    <AuthLayout
      kicker={step === "request" ? "LOST YOUR CODE?" : "ALMOST THERE"}
      title={step === "request" ? "Recover access" : "Set new code"}
      subtitle={
        step === "request"
          ? "Enter your traveler name and we'll generate a reset code."
          : devToken
          ? "No email service is connected in this demo, so your code is shown below."
          : "Enter the reset code and your new password."
      }
      footer={
        <Link to="/signin" className="text-white font-bold underline decoration-[#8b6bff]">
          Back to sign in
        </Link>
      }
    >
      {step === "request" ? (
        <form onSubmit={requestCode}>
          <PixelField label="Traveler name" value={username} onChange={setUsername} required />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 font-pixel text-xs text-[#fff3e6] bg-[#c9502f] shadow-[0_5px_0_#8a3018] hover:bg-[#d96038] active:translate-y-[5px] active:shadow-none transition disabled:opacity-60"
          >
            {loading ? "SENDING…" : "▶ SEND RESET CODE"}
          </button>
        </form>
      ) : (
        <>
          {devToken && (
            <div className="mb-4 bg-[rgba(155,143,255,0.12)] border-2 border-[rgba(155,143,255,0.35)] px-3 py-2.5 text-sm text-[#d8cfff] break-all font-retro">
              {devToken}
            </div>
          )}
          <form onSubmit={resetPassword}>
            <PixelField label="Reset code" value={token} onChange={setToken} required />
            <PixelPasswordField
              label="New secret code"
              value={newPassword}
              onChange={setNewPassword}
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 font-pixel text-xs text-[#fff3e6] bg-[#c9502f] shadow-[0_5px_0_#8a3018] hover:bg-[#d96038] active:translate-y-[5px] active:shadow-none transition disabled:opacity-60"
            >
              {loading ? "UPDATING…" : "▶ UPDATE CODE"}
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
