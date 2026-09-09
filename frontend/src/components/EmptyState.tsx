export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center border-2 border-dashed border-swiss-faint">
      <p className="font-extrabold text-5xl text-swiss-faint select-none">∅</p>
      <p className="text-sm text-swiss-muted max-w-xs">{message}</p>
    </div>
  );
}
