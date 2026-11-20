import { ToolCard } from "@/components/tool-card";
import type { Tool } from "@/lib/catalog";

export function ToolGrid({ tools }: { tools: Tool[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </ul>
  );
}
