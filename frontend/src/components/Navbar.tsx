import { useNavigate } from "react-router-dom";
import { BrainIcon, ShareIcon } from "./Icons";

interface NavbarProps {
  username?: string;
  onShareClick?: () => void;
}

export function Navbar({ username, onShareClick }: NavbarProps) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/signin");
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
      <div className="flex items-center gap-2 text-zinc-800 font-semibold">
        <BrainIcon className="w-6 h-6 text-brand-600" />
        Second Brain
      </div>

      <div className="flex items-center gap-3">
        {username && <span className="hidden sm:block text-sm text-zinc-500">Hi, {username}</span>}
        {onShareClick && (
          <button
            onClick={onShareClick}
            className="flex items-center gap-1.5 text-sm font-medium bg-brand-600 text-white px-3.5 py-2 rounded-lg hover:bg-brand-700 transition"
          >
            <ShareIcon /> Share Brain
          </button>
        )}
        {username && (
          <button
            onClick={logout}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-800 px-3 py-2 transition"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
