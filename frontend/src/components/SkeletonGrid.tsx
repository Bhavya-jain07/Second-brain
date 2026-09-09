export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t-2 border-l-2 border-swiss-ink">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-r-2 border-b-2 border-swiss-ink bg-white overflow-hidden animate-pulse">
          <div className="aspect-video bg-swiss-panel border-b-2 border-swiss-ink" />
          <div className="p-3.5 space-y-2">
            <div className="h-2.5 bg-swiss-panel w-1/3" />
            <div className="h-3 bg-swiss-panel w-4/5" />
            <div className="h-2.5 bg-swiss-panel w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
