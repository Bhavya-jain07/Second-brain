import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useToast, friendlyError } from "../components/Toast";
import { AuthLayout } from "../components/AuthLayout";
import { PixelField, PixelPasswordField } from "../components/PixelField";
import { OAuthRow } from "../components/OAuthRow";

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
    <AuthLayout
      kicker="NEW JOURNEY"
      title={"Save it once.\nFind it forever."}
      subtitle="Drop in a video, a thread, a file — it's yours to find again in one search."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/signin" className="text-white font-bold underline decoration-[#8b6bff]">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit}>
        <PixelField
          label="Traveler name"
          value={username}
          onChange={setUsername}
          placeholder="e.g. bhavya"
          required
          minLength={3}
        />
        <PixelPasswordField
          label="Secret code"
          value={password}
          onChange={setPassword}
          placeholder="At least 6 characters"
          hint="At least 6 characters"
          required
          minLength={6}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 font-pixel text-xs text-[#fff3e6] bg-[#c9502f] shadow-[0_5px_0_#8a3018] hover:bg-[#d96038] active:translate-y-[5px] active:shadow-none transition disabled:opacity-60"
        >
          {loading ? "CREATING…" : "▶ BEGIN JOURNEY"}
        </button>
      </form>

      <OAuthRow />
    </AuthLayout>
  );
}
