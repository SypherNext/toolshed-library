import { connection } from "next/server";
import { ToolGrid } from "@/components/tool-grid";
import { latestTools } from "@/lib/data/tools";

const RECENT_TOOL_COUNT = 4;

export async function RecentTools() {
  // Wait for a real visitor, so `next build` never needs the database (in Docker there is
  // none while the image is built). latestTools() is still cached between visitors.
  await connection();
  const tools = await latestTools(RECENT_TOOL_COUNT);
  return <ToolGrid tools={tools} />;
}
