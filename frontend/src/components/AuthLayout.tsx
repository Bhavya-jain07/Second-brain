import { ReactNode } from "react";

interface AuthLayoutProps {
  kicker: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

/**
 * Shared visual shell for the signup/signin pages: the hand-generated
 * pixel-art sunset scene as a background, with a frosted glass panel
 * holding the actual form. Deliberately kept separate from the dashboard's
 * Swiss-style design — this "cinematic" look is reserved for the
 * entry/auth screens only (see design notes in README).
 */
export function AuthLayout({ kicker, title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen min-h-[100dvh] flex items-center justify-center px-4 py-10 relative font-retro text-lg"
      style={{
        backgroundImage: "url('/auth-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        imageRendering: "pixelated",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,6,10,0.15), rgba(10,6,10,0.55) 70%, rgba(10,6,10,0.75))",
        }}
      />

      <div className="relative z-10 w-full max-w-[380px] bg-[rgba(20,12,16,0.55)] backdrop-blur-md border-2 border-[rgba(255,214,150,0.35)] shadow-[8px_8px_0_rgba(0,0,0,0.4)] p-8 pt-9">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-2 h-2 bg-[#ffd696]" />
          <span className="font-pixel text-[9px] text-[#ffd696]">SECOND BRAIN</span>
          <span className="w-2 h-2 bg-[#ffd696]" />
        </div>

        <p className="font-pixel text-[11px] text-[#9b8fff] mb-2.5">{kicker}</p>
        <h1 className="font-pixel text-[16px] text-[#ffe4b8] leading-relaxed mb-2 whitespace-pre-line [text-shadow:2px_2px_0_rgba(0,0,0,0.5)]">
          {title}
        </h1>
        <p className="text-[#d8bfae] text-lg mb-6 leading-snug">{subtitle}</p>

        {children}

        <p className="text-center mt-6 text-base text-[#d8bfae]">{footer}</p>
      </div>
    </div>
  );
}
