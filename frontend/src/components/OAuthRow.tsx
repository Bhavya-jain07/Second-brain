import { useToast } from "./Toast";

export function OAuthRow() {
  const { showToast } = useToast();

  function notReady(provider: string) {
    showToast(`${provider} sign-in isn't set up yet — coming soon`, "error");
  }

  return (
    <>
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-[rgba(255,214,150,0.2)]" />
        <span className="font-pixel text-[8px] text-[#d8bfae]">OR CONTINUE WITH</span>
        <div className="flex-1 h-px bg-[rgba(255,214,150,0.2)]" />
      </div>
      <div className="flex gap-3 justify-center">
        <button
          type="button"
          onClick={() => notReady("Google")}
          aria-label="Continue with Google"
          className="w-11 h-11 flex items-center justify-center bg-[rgba(10,6,8,0.55)] border-2 border-[rgba(255,214,150,0.3)] hover:border-[#ffd696] hover:-translate-y-0.5 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 10.2v3.9h5.5c-.24 1.28-1.68 3.75-5.5 3.75-3.31 0-6.02-2.74-6.02-6.12S8.19 5.62 11.5 5.62c1.89 0 3.16.8 3.88 1.49l2.65-2.55C16.42 2.94 14.3 2 11.5 2 6.36 2 2.2 6.2 2.2 11.75S6.36 21.5 11.5 21.5c6.63 0 9.5-4.66 9.5-9.5 0-.64-.07-1.13-.15-1.6z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => notReady("GitHub")}
          aria-label="Continue with GitHub"
          className="w-11 h-11 flex items-center justify-center bg-[rgba(10,6,8,0.55)] border-2 border-[rgba(255,214,150,0.3)] hover:border-[#ffd696] hover:-translate-y-0.5 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#e4e4e7">
            <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5v-1.75c-2.78.63-3.37-1.37-3.37-1.37-.46-1.2-1.11-1.53-1.11-1.53-.9-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.6 2.36 1.14 2.94.87.09-.68.35-1.14.63-1.4-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.76 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.33 2.74-1.05 2.74-1.05.56 1.44.2 2.5.1 2.76.65.72 1.03 1.63 1.03 2.75 0 3.94-2.35 4.8-4.58 5.06.36.32.68.94.68 1.9v2.82c0 .28.18.6.69.5A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
          </svg>
        </button>
      </div>
    </>
  );
}
