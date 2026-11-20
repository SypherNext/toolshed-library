import type { Metadata } from "next";
import { ToolForm } from "@/components/tool-form";
import { requireMember } from "@/lib/current-member";

export const metadata: Metadata = {
  title: "Add a tool",
};

export default async function NewToolPage() {
  await requireMember("/tools/new");

  return (
    <section className="max-w-xl space-y-6">
      <h1 className="text-3xl font-bold">Add a tool</h1>
      <ToolForm />
    </section>
  );
}
