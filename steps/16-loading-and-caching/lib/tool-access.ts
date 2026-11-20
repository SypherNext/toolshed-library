// Loads a tool for its owner, or shows "not found" to anyone else. Pages and actions that
// change a tool all start here, so none of them can forget the ownership check.
import "server-only";
import { notFound } from "next/navigation";
import { requireMember } from "@/lib/current-member";
import { findTool } from "@/lib/data/tools";
import { canEditTool } from "@/lib/permissions";

export async function requireOwnedTool(toolId: number) {
  const member = await requireMember(`/tools/${toolId}`);
  const tool = await findTool(toolId);

  // A stranger gets the same answer as for a tool that does not exist,
  // so the page does not even confirm which tools are someone else's.
  if (!tool || !canEditTool(member, tool)) notFound();
  return { member, tool };
}
