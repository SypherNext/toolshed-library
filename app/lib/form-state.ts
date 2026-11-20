// What a Server Action sends back to its form: field errors, a message,
// and the values the person typed, so a failed submit never wipes their work.
import * as z from "zod";

export type FormState = {
  fieldErrors?: Record<string, string[] | undefined>;
  message?: string;
  succeeded?: boolean;
  values?: Record<string, string>;
};

export const emptyFormState: FormState = {};

// Fields that must never travel back to the browser, even after a failed submit.
const SECRET_FIELDS = new Set(["password"]);

export function formValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData) {
    // React adds hidden "$ACTION_..." fields of its own; they are not the person's input.
    if (key.startsWith("$") || SECRET_FIELDS.has(key)) continue;
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

export function failedFormState(message: string, formData: FormData): FormState {
  return { message, values: formValues(formData) };
}

export function succeededFormState(message: string): FormState {
  return { message, succeeded: true };
}
