import Form from "next/form";
import Link from "next/link";
import type { CatalogFilters } from "@/lib/catalog-filters";
import { categories } from "@/lib/categories";

const fieldStyle = "rounded-md border border-stone-300 bg-white px-3 py-2";

export function CatalogSearchForm({ filters }: { filters: CatalogFilters }) {
  return (
    <Form action="/tools" className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Name
        <input
          name="q"
          defaultValue={filters.query}
          placeholder="drill, ladder..."
          className={fieldStyle}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Category
        <select name="category" defaultValue={filters.category ?? ""} className={fieldStyle}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 py-2 text-sm">
        <input type="checkbox" name="available" value="1" defaultChecked={filters.availableOnly} />
        Available now
      </label>
      <button
        type="submit"
        className="rounded-md bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800"
      >
        Search
      </button>
      <Link href="/tools" className="py-2 text-sm text-stone-600 underline">
        Clear
      </Link>
    </Form>
  );
}
