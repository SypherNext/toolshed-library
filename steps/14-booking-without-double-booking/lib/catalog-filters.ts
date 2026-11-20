// Turns the catalog's address (?q=drill&category=garden&available=1) into clean filters.
import { categories, type CategorySlug } from "@/lib/categories";

export type CatalogFilters = {
  query: string;
  category: CategorySlug | null;
  availableOnly: boolean;
};

type SearchParams = Record<string, string | string[] | undefined>;

const MAX_QUERY_LENGTH = 80;

function firstValue(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

function isCategorySlug(value: string): value is CategorySlug {
  return categories.some((category) => category.slug === value);
}

export function parseCatalogFilters(searchParams: SearchParams): CatalogFilters {
  const query = firstValue(searchParams.q).trim().slice(0, MAX_QUERY_LENGTH);
  const category = firstValue(searchParams.category);

  return {
    query,
    category: isCategorySlug(category) ? category : null,
    availableOnly: firstValue(searchParams.available) === "1",
  };
}

export function hasActiveFilters(filters: CatalogFilters): boolean {
  return filters.query !== "" || filters.category !== null || filters.availableOnly;
}
