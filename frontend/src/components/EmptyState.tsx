export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="text-zinc-200">
        <circle cx="36" cy="36" r="34" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" />
        <g className="animate-float">
          <path
            d="M28 24a6 6 0 0 1 6-6 4 4 0 0 1 4 4v24a3 3 0 0 1-5.4 1.8A4 4 0 0 1 24 46a4 4 0 0 1-1.2-7.8A5 5 0 0 1 22 28a5 5 0 0 1 6-4.9"
            stroke="#a1a1aa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M44 24a6 6 0 0 0-6-6 4 4 0 0 0-4 4v24a3 3 0 0 0 5.4 1.8A4 4 0 0 0 48 46a4 4 0 0 0 1.2-7.8A5 5 0 0 0 50 28a5 5 0 0 0-6-4.9"
            stroke="#a1a1aa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
      <p className="text-sm text-zinc-500 max-w-xs">{message}</p>
    </div>
  );
}
