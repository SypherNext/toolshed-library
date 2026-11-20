"use client";

import { useActionState } from "react";
import { FormField } from "@/components/form-field";
import { FormMessage } from "@/components/form-message";
import { inputStyle } from "@/components/styles";
import { SubmitButton } from "@/components/submit-button";
import { categories } from "@/lib/categories";
import { emptyFormState, type FormState } from "@/lib/form-state";
import { PHOTO_MAX_MEGABYTES } from "@/lib/validation/tool";

type ToolFormProps = {
  action: (previousState: FormState, formData: FormData) => Promise<FormState>;
  initialValues?: Record<string, string>;
  submitLabel: string;
  pendingLabel: string;
};

// The add page and the edit page both use this form; only the action and labels differ.
export function ToolForm({ action, initialValues = {}, submitLabel, pendingLabel }: ToolFormProps) {
  const [state, formAction] = useActionState(action, emptyFormState);
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? initialValues;

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <FormMessage message={state.message} />
      <FormField label="Name" errors={errors.name}>
        <input name="name" defaultValue={values.name} className={inputStyle} />
      </FormField>
      <FormField label="Category" errors={errors.category}>
        <select name="category" defaultValue={values.category} className={inputStyle}>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.label}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Description" errors={errors.description}>
        <textarea
          name="description"
          rows={4}
          defaultValue={values.description}
          className={inputStyle}
        />
      </FormField>
      <FormField label={`Photo (PNG, JPEG or WebP, up to ${PHOTO_MAX_MEGABYTES} MB)`} errors={errors.photo}>
        <input
          type="file"
          name="photo"
          accept="image/png,image/jpeg,image/webp"
          className={inputStyle}
        />
      </FormField>
      <div>
        <SubmitButton label={submitLabel} pendingLabel={pendingLabel} />
      </div>
    </form>
  );
}
