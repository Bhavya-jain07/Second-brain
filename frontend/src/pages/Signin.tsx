import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useToast, friendlyError } from "../components/Toast";
import { AuthLayout } from "../components/AuthLayout";
import { PixelField, PixelPasswordField } from "../components/PixelField";
import { OAuthRow } from "../components/OAuthRow";

export function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/signin", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      navigate("/");
    } catch (err: any) {
      showToast(friendlyError(err), "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      kicker="WELCOME BACK"
      title={"Continue where\nyou left off."}
      subtitle="Sign in to see everything you've saved."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/signup" className="text-white font-bold underline decoration-[#8b6bff]">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit}>
        <PixelField label="Traveler name" value={username} onChange={setUsername} placeholder="Enter your username" required />
        <PixelPasswordField
          label="Secret code"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          required
          labelExtra={
            <Link to="/forgot-password" className="font-pixel text-[8px] text-[#9b8fff] hover:text-[#ffd696]">
              FORGOT?
            </Link>
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 font-pixel text-xs text-[#fff3e6] bg-[#c9502f] shadow-[0_5px_0_#8a3018] hover:bg-[#d96038] active:translate-y-[5px] active:shadow-none transition disabled:opacity-60"
        >
          {loading ? "SIGNING IN…" : "▶ CONTINUE JOURNEY"}
        </button>
      </form>

      <OAuthRow />
    </AuthLayout>
  );
}
