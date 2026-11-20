// A label, its input and any error messages for that input, laid out the same way in every form.
export function FormField({
  label,
  errors,
  children,
}: {
  label: string;
  errors?: string[];
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      {label}
      {children}
      {errors?.map((error) => (
        <span key={error} className="text-sm text-red-700">
          {error}
        </span>
      ))}
    </label>
  );
}
