import * as z from "zod";

export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 128;

// Trim and lower-case first, then check the format: zod runs the steps in order, so
// "Asha@Toolshed.test " is accepted and stored as "asha@toolshed.test".
const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "Enter an email address like name@example.com." }));

export const logInSchema = z.object({
  email,
  password: z.string().min(1, { error: "Enter your password." }),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Enter your name (at least 2 characters)." })
    .max(60, { error: "Keep your name under 60 characters." }),
  email,
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, { error: `Use at least ${PASSWORD_MIN_LENGTH} characters.` })
    .max(PASSWORD_MAX_LENGTH, { error: `Use at most ${PASSWORD_MAX_LENGTH} characters.` }),
});
