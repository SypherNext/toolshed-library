"use client";

import { useActionState } from "react";
import { FormField } from "@/components/form-field";
import { FormMessage } from "@/components/form-message";
import { inputStyle } from "@/components/styles";
import { SubmitButton } from "@/components/submit-button";
import { emptyFormState, type FormState } from "@/lib/form-state";

type ReserveFormProps = {
  action: (previousState: FormState, formData: FormData) => Promise<FormState>;
  today: string;
};

export function ReserveForm({ action, today }: ReserveFormProps) {
  const [state, formAction] = useActionState(action, emptyFormState);
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-stone-200 bg-white p-4" noValidate>
      <h2 className="font-semibold">Borrow this tool</h2>
      <FormMessage message={state.message} succeeded={state.succeeded} />
      <div className="grid grid-cols-2 gap-3">
        <FormField label="First day" errors={errors.startDate}>
          <input type="date" name="startDate" min={today} defaultValue={values.startDate} className={inputStyle} />
        </FormField>
        <FormField label="Last day" errors={errors.endDate}>
          <input type="date" name="endDate" min={today} defaultValue={values.endDate} className={inputStyle} />
        </FormField>
      </div>
      <SubmitButton label="Request to borrow" pendingLabel="Sending request..." />
    </form>
  );
}
