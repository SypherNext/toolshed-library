// What the person looking at a tool page may do with it: depends on who they are.
import Link from "next/link";
import { getCurrentMember } from "@/lib/current-member";
import type { Tool } from "@/lib/data/tools";
import { canEditTool, canReserveTool } from "@/lib/permissions";
import { loginPath } from "@/lib/redirects";

export async function ToolActions({ tool }: { tool: Tool }) {
  const member = await getCurrentMember();

  if (canEditTool(member, tool)) {
    return (
      <p className="rounded-md bg-stone-100 px-3 py-2 text-sm">
        This is your tool.{" "}
        <Link href={`/tools/${tool.id}/edit`} className="underline">
          Edit or delete it
        </Link>
      </p>
    );
  }

  if (canReserveTool(member, tool)) {
    return <p className="text-sm text-stone-600">Borrowing opens in the next lesson.</p>;
  }

  return (
    <p className="text-sm">
      <Link href={loginPath(`/tools/${tool.id}`)} className="underline">
        Log in to borrow this tool
      </Link>
    </p>
  );
}
