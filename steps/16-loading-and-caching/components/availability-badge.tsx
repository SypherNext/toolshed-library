export function AvailabilityBadge({ available }: { available: boolean }) {
  const colours = available
    ? "bg-emerald-100 text-emerald-800"
    : "bg-amber-100 text-amber-800";

  return (
    <span className={`shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${colours}`}>
      {available ? "Available now" : "On loan"}
    </span>
  );
}
