import Image from "next/image";
import Link from "next/link";
import { AvailabilityBadge } from "@/components/availability-badge";
import { categoryLabel } from "@/lib/categories";
import type { Tool } from "@/lib/catalog";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <li className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      <Link href={`/tools/${tool.id}`}>
        <Image src={tool.photo} alt={tool.name} width={640} height={480} />
        <div className="space-y-1 p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-semibold">{tool.name}</h2>
            <AvailabilityBadge available={tool.available} />
          </div>
          <p className="text-sm text-stone-500">{categoryLabel(tool.category)}</p>
        </div>
      </Link>
    </li>
  );
}
