"use client";

import Link from "next/link";
import { useActionState } from "react";
import { logIn, signUp } from "@/app/(auth)/actions";
import { FormField } from "@/components/form-field";
import { FormMessage } from "@/components/form-message";
import { inputStyle } from "@/components/styles";
import { SubmitButton } from "@/components/submit-button";
import { emptyFormState } from "@/lib/form-state";

// One form for both pages: sign-up adds a name field and uses a different action.
const modes = {
  signup: {
    action: signUp,
    button: "Create account",
    pending: "Creating account...",
    switchText: "Already a member?",
    switchLink: "/login",
    switchLabel: "Log in",
  },
  login: {
    action: logIn,
    button: "Log in",
    pending: "Logging in...",
    switchText: "New to Toolshed?",
    switchLink: "/signup",
    switchLabel: "Create an account",
  },
};

export function AuthForm({ mode, next }: { mode: keyof typeof modes; next: string }) {
  const settings = modes[mode];
  const [state, formAction] = useActionState(settings.action, emptyFormState);
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <FormMessage message={state.message} />
      <input type="hidden" name="next" value={next} />
      {mode === "signup" && (
        <FormField label="Your name" errors={errors.name}>
          <input name="name" autoComplete="name" defaultValue={values.name} className={inputStyle} />
        </FormField>
      )}
      <FormField label="Email" errors={errors.email}>
        <input
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={values.email}
          className={inputStyle}
        />
      </FormField>
      <FormField label="Password" errors={errors.password}>
        <input
          name="password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          className={inputStyle}
        />
      </FormField>
      <div className="flex items-center gap-4">
        <SubmitButton label={settings.button} pendingLabel={settings.pending} />
        <p className="text-sm text-stone-600">
          {settings.switchText}{" "}
          <Link href={`${settings.switchLink}?next=${encodeURIComponent(next)}`} className="underline">
            {settings.switchLabel}
          </Link>
        </p>
      </div>
    </form>
  );
}
