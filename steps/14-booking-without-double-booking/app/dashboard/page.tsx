import type { Metadata } from "next";
import Link from "next/link";
import { AvailabilityBadge } from "@/components/availability-badge";
import { primaryButtonStyle } from "@/components/styles";
import { requireMember } from "@/lib/current-member";
import { listToolsOwnedBy } from "@/lib/data/tools";
import { countLabel } from "@/lib/format";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const member = await requireMember("/dashboard");
  const myTools = await listToolsOwnedBy(member.id);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your dashboard</h1>
          <p className="text-stone-600">You lend {countLabel(myTools.length, "tool")}.</p>
        </div>
        <Link href="/tools/new" className={primaryButtonStyle}>
          Add a tool
        </Link>
      </div>
      <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
        {myTools.map((tool) => (
          <li key={tool.id} className="flex items-center justify-between gap-4 px-4 py-3">
            <Link href={`/tools/${tool.id}`} className="font-medium hover:underline">
              {tool.name}
            </Link>
            <div className="flex items-center gap-4">
              <AvailabilityBadge available={tool.available} />
              <Link href={`/tools/${tool.id}/edit`} className="text-sm underline">
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
