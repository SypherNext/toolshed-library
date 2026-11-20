import Link from "next/link";
import { AvailabilityBadge } from "@/components/availability-badge";
import type { Tool } from "@/lib/data/tools";

export function OwnedToolList({ tools }: { tools: Tool[] }) {
  return (
    <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
      {tools.map((tool) => (
        <li key={tool.id} className="flex items-center justify-between gap-4 px-4 py-3">
          <Link href={`/tools/${tool.id}`} className="font-medium hover:underline">
            {tool.name}
          </Link>
          <div className="flex items-center gap-4">
            <AvailabilityBadge available={tool.available} />
            <Link href={`/tools/${tool.id}/edit`} className="text-sm underline">
              Edit
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
