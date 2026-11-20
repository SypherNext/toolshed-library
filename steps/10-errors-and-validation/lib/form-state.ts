// What a Server Action sends back to its form: field errors, a general message,
// and the values the person typed, so a failed submit never wipes their work.
import * as z from "zod";

export type FormState = {
  fieldErrors?: Record<string, string[] | undefined>;
  message?: string;
  values?: Record<string, string>;
};

export const emptyFormState: FormState = {};

export function formValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData) {
    // React adds hidden "$ACTION_..." fields of its own; they are not the person's input.
    if (key.startsWith("$")) continue;
    if (typeof value === "string") values[key] = value;
  }
  return values;
}

export function invalidFormState(error: z.ZodError, formData: FormData): FormState {
  return {
    fieldErrors: z.flattenError(error).fieldErrors,
    message: "Please fix the highlighted fields.",
    values: formValues(formData),
  };
}
