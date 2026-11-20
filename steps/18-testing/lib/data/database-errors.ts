// PostgreSQL reports every failure with a five-character code. Drizzle wraps the error,
// so the code is on the error itself or on its "cause".
const EXCLUSION_VIOLATION = "23P01";

function postgresCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  if ("code" in error && typeof error.code === "string") return error.code;
  return "cause" in error ? postgresCode(error.cause) : undefined;
}

// True when an EXCLUDE constraint (our "no overlapping bookings" rule) refused a row.
export function isOverlapError(error: unknown): boolean {
  return postgresCode(error) === EXCLUSION_VIOLATION;
}
