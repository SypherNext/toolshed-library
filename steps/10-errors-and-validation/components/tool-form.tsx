"use client";

import { useActionState } from "react";
import { addTool } from "@/app/tools/actions";
import { FormField } from "@/components/form-field";
import { FormMessage } from "@/components/form-message";
import { inputStyle } from "@/components/styles";
import { SubmitButton } from "@/components/submit-button";
import { categories } from "@/lib/categories";
import { emptyFormState } from "@/lib/form-state";

export function ToolForm() {
  const [state, formAction] = useActionState(addTool, emptyFormState);
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};

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
      <div>
        <SubmitButton label="Add tool" pendingLabel="Adding..." />
      </div>
    </form>
  );
}
