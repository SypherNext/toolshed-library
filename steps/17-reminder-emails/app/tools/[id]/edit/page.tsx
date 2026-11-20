import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolForm } from "@/components/tool-form";
import { parseId } from "@/lib/route-params";
import { requireOwnedTool } from "@/lib/tool-access";
import { editTool, removeTool } from "../../actions";

export const metadata: Metadata = {
  title: "Edit tool",
};

export default async function EditToolPage({ params }: PageProps<"/tools/[id]/edit">) {
  const toolId = parseId((await params).id);
  if (!toolId) notFound();
  const { tool } = await requireOwnedTool(toolId);

  return (
    <section className="max-w-xl space-y-6">
      <h1 className="text-3xl font-bold">Edit {tool.name}</h1>
      <ToolForm
        action={editTool.bind(null, tool.id)}
        initialValues={{ name: tool.name, category: tool.category, description: tool.description }}
        submitLabel="Save changes"
        pendingLabel="Saving..."
      />
      <form action={removeTool.bind(null, tool.id)} className="border-t border-stone-200 pt-6">
        <button type="submit" className="text-sm text-red-700 underline">
          Delete this tool
        </button>
      </form>
    </section>
  );
}
