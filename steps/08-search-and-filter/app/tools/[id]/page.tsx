import Image from "next/image";
import { AvailabilityBadge } from "@/components/availability-badge";
import { ShareButton } from "@/components/share-button";
import { categoryLabel } from "@/lib/categories";
import { findTool } from "@/lib/data/tools";

export default async function ToolPage({ params }: PageProps<"/tools/[id]">) {
  const { id } = await params;
  const tool = await findTool(Number(id));

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
        src={tool.photoUrl}
        alt={tool.name}
        width={640}
        height={480}
        loading="eager"
        className="rounded-lg border border-stone-200"
      />
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">{tool.name}</h1>
        <div className="flex items-center gap-3">
          <span className="text-stone-500">{categoryLabel(tool.category)}</span>
          <AvailabilityBadge available={tool.available} />
        </div>
        <p>{tool.description}</p>
        <p className="text-sm text-stone-600">Lent by {tool.ownerName}</p>
        <ShareButton path={`/tools/${tool.id}`} />
      </div>
    </article>
  );
}
