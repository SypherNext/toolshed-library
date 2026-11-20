import type { Metadata } from "next";
import { inputStyle } from "@/components/styles";
import { SubmitButton } from "@/components/submit-button";
import { categories } from "@/lib/categories";
import { addTool } from "../actions";

export const metadata: Metadata = {
  title: "Add a tool",
};

export default function NewToolPage() {
  return (
    <section className="max-w-xl space-y-6">
      <h1 className="text-3xl font-bold">Add a tool</h1>
      <form action={addTool} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          Name
          <input name="name" className={inputStyle} />
        </label>
        <label className="flex flex-col gap-1">
          Category
          <select name="category" className={inputStyle}>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          Description
          <textarea name="description" rows={4} className={inputStyle} />
        </label>
        <div>
          <SubmitButton label="Add tool" pendingLabel="Adding..." />
        </div>
      </form>
    </section>
  );
}
