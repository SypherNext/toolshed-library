import Image from "next/image";
import { notFound } from "next/navigation";
import { AvailabilityBadge } from "@/components/availability-badge";
import { BookedDates } from "@/components/booked-dates";
import { ShareButton } from "@/components/share-button";
import { ToolActions } from "@/components/tool-actions";
import { categoryLabel } from "@/lib/categories";
import { findTool } from "@/lib/data/tools";
import { parseId } from "@/lib/route-params";

export default async function ToolPage({ params }: PageProps<"/tools/[id]">) {
  const { id } = await params;
  const toolId = parseId(id);
  const tool = toolId ? await findTool(toolId) : undefined;
  if (!tool) notFound();

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
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{tool.name}</h1>
        <div className="flex items-center gap-3">
          <span className="text-stone-500">{categoryLabel(tool.category)}</span>
          <AvailabilityBadge available={tool.available} />
        </div>
        <p>{tool.description}</p>
        <p className="text-sm text-stone-600">Lent by {tool.ownerName}</p>
        <ShareButton path={`/tools/${tool.id}`} />
        <BookedDates toolId={tool.id} />
        <ToolActions tool={tool} />
      </div>
    </article>
  );
}
