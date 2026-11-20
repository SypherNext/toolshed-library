import { listBookedDates } from "@/lib/data/reservations";
import { formatDateRange, todayIsoDate } from "@/lib/dates";

export async function BookedDates({ toolId }: { toolId: number }) {
  const booked = await listBookedDates(toolId, todayIsoDate());
  if (booked.length === 0) return <p className="text-sm text-stone-600">No bookings yet: every day is free.</p>;

  return (
    <div className="text-sm">
      <h2 className="font-semibold">Already booked</h2>
      <ul className="list-disc pl-5 text-stone-700">
        {booked.map((range) => (
          <li key={range.startDate}>{formatDateRange(range.startDate, range.endDate)}</li>
        ))}
      </ul>
    </div>
  );
}
