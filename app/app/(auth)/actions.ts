"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { failedFormState, invalidFormState, type FormState } from "@/lib/form-state";
import { createRateLimiter } from "@/lib/rate-limit";
import { safeNextPath } from "@/lib/redirects";
import { logInSchema, signUpSchema } from "@/lib/validation/auth";

const ONE_MINUTE_MS = 60_000;
const TOO_MANY_TRIES = "Too many tries. Please wait a minute and try again.";

// Better Auth limits requests to its own /api/auth addresses, but these actions call it
// directly, so they keep their own counts: 5 logins per email per minute stops password
// guessing, and 5 sign-ups per address per 10 minutes slows down fake accounts.
const loginAttempts = createRateLimiter({ limit: 5, windowMs: ONE_MINUTE_MS });
const signUpAttempts = createRateLimiter({ limit: 5, windowMs: 10 * ONE_MINUTE_MS });

// Better Auth error codes we explain in plain words. Anything else gets a general message.
const friendlyMessages: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "That email and password do not match an account.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "An account with that email already exists. Try logging in.",
};

function authFailedState(error: unknown, formData: FormData): FormState {
  if (!(error instanceof APIError)) throw error;
  const code = String(error.body?.code ?? "");
  return failedFormState(friendlyMessages[code] ?? "We could not do that right now. Please try again.", formData);
}

// The visitor's network address as the server saw it ("unknown" if it is missing).
async function clientAddress(): Promise<string> {
  return (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

export async function signUp(_previousState: FormState, formData: FormData): Promise<FormState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalidFormState(parsed.error, formData);
  if (!signUpAttempts(await clientAddress())) return failedFormState(TOO_MANY_TRIES, formData);

  try {
    await auth.api.signUpEmail({ body: parsed.data, headers: await headers() });
  } catch (error) {
    return authFailedState(error, formData);
  }
  redirect(safeNextPath(formData.get("next")));
}

export async function logIn(_previousState: FormState, formData: FormData): Promise<FormState> {
  const parsed = logInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalidFormState(parsed.error, formData);
  if (!loginAttempts(parsed.data.email)) return failedFormState(TOO_MANY_TRIES, formData);

  try {
    await auth.api.signInEmail({ body: parsed.data, headers: await headers() });
  } catch (error) {
    return authFailedState(error, formData);
  }
  redirect(safeNextPath(formData.get("next")));
}

export async function logOut() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/");
}
