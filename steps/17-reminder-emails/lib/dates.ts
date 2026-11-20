// Toolshed books whole days. Dates travel as "YYYY-MM-DD" text, the format of <input type="date">
// and of PostgreSQL's date type, so no time zone can shift a booking by a day.
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function todayIsoDate(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

// Both ends count: Saturday to Sunday is 2 days.
export function daysInclusive(startDate: string, endDate: string): number {
  return (Date.parse(endDate) - Date.parse(startDate)) / MS_PER_DAY + 1;
}

const dayFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function formatDay(isoDate: string): string {
  return dayFormat.format(new Date(isoDate));
}

export function formatDateRange(startDate: string, endDate: string): string {
  return startDate === endDate
    ? formatDay(startDate)
    : `${formatDay(startDate)} to ${formatDay(endDate)}`;
}
