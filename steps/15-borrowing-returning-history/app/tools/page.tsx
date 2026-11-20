import type { Metadata } from "next";
import Link from "next/link";
import { CatalogSearchForm } from "@/components/catalog-search-form";
import { ToolGrid } from "@/components/tool-grid";
import { hasActiveFilters, parseCatalogFilters } from "@/lib/catalog-filters";
import { searchTools } from "@/lib/data/tools";
import { countLabel } from "@/lib/format";

export const metadata: Metadata = {
  title: "Catalog",
};

export default async function CatalogPage({ searchParams }: PageProps<"/tools">) {
  const filters = parseCatalogFilters(await searchParams);
  const tools = await searchTools(filters);
  const toolCount = countLabel(tools.length, "tool");
  const summary = hasActiveFilters(filters)
    ? `Found ${toolCount}`
    : `${toolCount} on your street`;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All tools</h1>
        <p className="text-stone-600">{summary}</p>
      </div>
      <CatalogSearchForm filters={filters} />
      {tools.length > 0 ? (
        <ToolGrid tools={tools} />
      ) : (
        <p className="rounded-lg border border-dashed border-stone-300 p-8 text-center text-stone-600">
          No tools match. Try another word, or{" "}
          <Link href="/tools" className="underline">
            show every tool
          </Link>
          .
        </p>
      )}
    </section>
  );
}
