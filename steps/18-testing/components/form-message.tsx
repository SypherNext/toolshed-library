export function FormMessage({ message, succeeded = false }: { message?: string; succeeded?: boolean }) {
  if (!message) return null;

  const colours = succeeded
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : "border-red-200 bg-red-50 text-red-800";

  return (
    <p role={succeeded ? "status" : "alert"} className={`rounded-md border px-3 py-2 ${colours}`}>
      {message}
    </p>
  );
}
