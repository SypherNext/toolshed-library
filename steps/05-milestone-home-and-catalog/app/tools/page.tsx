import type { Metadata } from "next";
import { ToolGrid } from "@/components/tool-grid";
import { listTools } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catalog",
};

export default function CatalogPage() {
  const tools = listTools();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All tools</h1>
        <p className="text-stone-600">{tools.length} tools on your street</p>
      </div>
      <ToolGrid tools={tools} />
    </section>
  );
}
