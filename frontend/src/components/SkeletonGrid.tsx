export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-zinc-200 overflow-hidden animate-pulse">
          <div className="aspect-video bg-zinc-100" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-zinc-100 rounded w-4/5" />
            <div className="h-2.5 bg-zinc-100 rounded w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
