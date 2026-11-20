// The one list of tool categories. Pages, forms and (later) the database all read it from here.
export const categories = [
  { slug: "power-tools", label: "Power tools" },
  { slug: "garden", label: "Garden" },
  { slug: "ladders", label: "Ladders" },
  { slug: "hand-tools", label: "Hand tools" },
  { slug: "cleaning", label: "Cleaning" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export function categoryLabel(slug: CategorySlug): string {
  return categories.find((category) => category.slug === slug)?.label ?? slug;
}
