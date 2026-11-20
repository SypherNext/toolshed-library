// Every database read and write about tools goes through this file,
// so pages and actions never write SQL themselves.
import "server-only";
import { and, asc, desc, eq, ilike, type SQL } from "drizzle-orm";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import type { CatalogFilters } from "@/lib/catalog-filters";
import type { CategorySlug } from "@/lib/categories";
import { db } from "@/lib/db";
import { members, tools } from "@/lib/db/schema";

// Every cached read below carries this tag. Every write calls forgetCachedTools(),
// so a change shows up on the next page view instead of after the cache expires.
const TOOLS_CACHE_TAG = "tools";

export function forgetCachedTools(): void {
  updateTag(TOOLS_CACHE_TAG);
}

const toolColumns = {
  id: tools.id,
  name: tools.name,
  category: tools.category,
  description: tools.description,
  photoUrl: tools.photoUrl,
  available: tools.available,
  ownerId: tools.ownerId,
  ownerName: members.name,
};

function selectTools() {
  return db
    .select(toolColumns)
    .from(tools)
    .innerJoin(members, eq(tools.ownerId, members.id));
}

// % and _ are wildcards in LIKE patterns, so a search for "50%" must escape them.
function containsPattern(text: string): string {
  const escaped = text.replace(/[\\%_]/g, (character) => `\\${character}`);
  return `%${escaped}%`;
}

export async function searchTools(filters: CatalogFilters) {
  const conditions: SQL[] = [];
  if (filters.query) conditions.push(ilike(tools.name, containsPattern(filters.query)));
  if (filters.category) conditions.push(eq(tools.category, filters.category));
  if (filters.availableOnly) conditions.push(eq(tools.available, true));

  return selectTools()
    .where(and(...conditions))
    .orderBy(asc(tools.name));
}

export type Tool = Awaited<ReturnType<typeof searchTools>>[number];

export async function latestTools(count: number): Promise<Tool[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TOOLS_CACHE_TAG);
  return selectTools().orderBy(desc(tools.createdAt), desc(tools.id)).limit(count);
}

export async function findTool(id: number): Promise<Tool | undefined> {
  "use cache";
  cacheLife("hours");
  cacheTag(TOOLS_CACHE_TAG);
  const [tool] = await selectTools().where(eq(tools.id, id));
  return tool;
}

export async function listToolsOwnedBy(memberId: string): Promise<Tool[]> {
  return selectTools().where(eq(tools.ownerId, memberId)).orderBy(asc(tools.name));
}

export type ToolDetails = {
  name: string;
  category: CategorySlug;
  description: string;
  photoUrl: string;
};

export async function createTool(details: ToolDetails & { ownerId: string }): Promise<number> {
  const [created] = await db.insert(tools).values(details).returning({ id: tools.id });
  forgetCachedTools();
  return created.id;
}

export async function updateTool(toolId: number, details: Partial<ToolDetails>): Promise<void> {
  await db.update(tools).set(details).where(eq(tools.id, toolId));
  forgetCachedTools();
}

export async function deleteTool(toolId: number): Promise<void> {
  await db.delete(tools).where(eq(tools.id, toolId));
  forgetCachedTools();
}
