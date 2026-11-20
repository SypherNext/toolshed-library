import type { Metadata } from "next";
import { ToolForm } from "@/components/tool-form";

export const metadata: Metadata = {
  title: "Add a tool",
};

export default function NewToolPage() {
  return (
    <section className="max-w-xl space-y-6">
      <h1 className="text-3xl font-bold">Add a tool</h1>
      <ToolForm />
    </section>
  );
}
