import Image from "next/image";
import { findTool } from "@/lib/catalog";

export default async function ToolPage({ params }: PageProps<"/tools/[id]">) {
  const { id } = await params;
  const tool = findTool(Number(id));

  if (!tool) {
    return (
      <section>
        <h1 className="text-3xl font-bold">Tool not found</h1>
        <p>There is no tool with the number {id}.</p>
      </section>
    );
  }

  return (
    <article className="grid gap-8 md:grid-cols-2">
      <Image
        src={tool.photo}
        alt={tool.name}
        width={640}
        height={480}
        className="rounded-lg border border-stone-200"
      />
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">{tool.name}</h1>
        <p className="text-stone-500">{tool.category}</p>
        <p>{tool.description}</p>
        <p className="text-sm text-stone-600">Lent by {tool.ownerName}</p>
      </div>
    </article>
  );
}
