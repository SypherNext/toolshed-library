"use client";

import { useFormStatus } from "react-dom";
import { primaryButtonStyle } from "@/components/styles";

export function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={primaryButtonStyle}>
      {pending ? pendingLabel : label}
    </button>
  );
}
