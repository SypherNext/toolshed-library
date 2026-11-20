// Grey placeholder cards, shaped like the real grid, shown while the catalog loads.
const DEFAULT_PLACEHOLDER_CARDS = 8;

export function ToolGridSkeleton({ count = DEFAULT_PLACEHOLDER_CARDS }: { count?: number }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading tools">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="animate-pulse overflow-hidden rounded-lg border border-stone-200 bg-white">
          <div className="aspect-[4/3] bg-stone-200" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-2/3 rounded bg-stone-200" />
            <div className="h-3 w-1/3 rounded bg-stone-100" />
          </div>
        </li>
      ))}
    </ul>
  );
}
