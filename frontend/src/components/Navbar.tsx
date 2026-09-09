import { useNavigate } from "react-router-dom";
import { ShareIcon } from "./Icons";

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
    <div className="border-b-[3px] border-swiss-ink px-6 md:px-10 pt-5 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute right-6 -top-8 text-[110px] md:text-[150px] font-extrabold leading-none pointer-events-none select-none text-transparent"
        style={{ WebkitTextStroke: "2px rgba(17,17,17,0.08)" }}
      >
        02
      </div>

      <div className="relative z-[1] flex items-center justify-between pb-5">
        <div className="font-extrabold text-lg tracking-tight">
          SECOND<span className="text-swiss-accent">.</span>BRAIN
        </div>

        <div className="flex items-center gap-5">
          {username && <span className="hidden sm:block text-sm">hi, {username}</span>}
          {onShareClick && (
            <button
              onClick={onShareClick}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide bg-swiss-ink text-swiss-bg px-4 py-2.5 hover:bg-swiss-accent transition"
            >
              <ShareIcon className="w-3.5 h-3.5" />
              Share Brain
            </button>
          )}
          {username && (
            <button
              onClick={logout}
              className="text-xs font-bold uppercase tracking-wide text-swiss-muted hover:text-swiss-accent transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
