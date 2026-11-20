// Every database read about tools goes through this file, so pages never write SQL themselves.
import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { members, tools } from "@/lib/db/schema";

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

export async function listTools() {
  return selectTools().orderBy(asc(tools.name));
}

export type Tool = Awaited<ReturnType<typeof listTools>>[number];

export async function latestTools(count: number): Promise<Tool[]> {
  return selectTools().orderBy(desc(tools.createdAt), desc(tools.id)).limit(count);
}

export async function findTool(id: number): Promise<Tool | undefined> {
  const [tool] = await selectTools().where(eq(tools.id, id));
  return tool;
}
