import { describe, expect, test } from "vitest";
import { parseCatalogFilters } from "@/lib/catalog-filters";

describe("reading the catalog address", () => {
  test("keeps a known category and the available box", () => {
    expect(parseCatalogFilters({ q: " drill ", category: "power-tools", available: "1" })).toEqual({
      query: "drill",
      category: "power-tools",
      availableOnly: true,
    });
  });

  test("ignores a category that does not exist", () => {
    expect(parseCatalogFilters({ category: "rockets" }).category).toBeNull();
  });
});
