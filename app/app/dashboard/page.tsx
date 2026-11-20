import type { Metadata } from "next";
import Link from "next/link";
import { OwnedToolList } from "@/components/owned-tool-list";
import { ReservationList } from "@/components/reservation-list";
import { primaryButtonStyle } from "@/components/styles";
import { requireMember } from "@/lib/current-member";
import { listBookingsForBorrower, listRequestsForOwner } from "@/lib/data/reservations";
import { listToolsOwnedBy } from "@/lib/data/tools";
import { countLabel } from "@/lib/format";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const member = await requireMember("/dashboard");
  const [requests, bookings, myTools] = await Promise.all([
    listRequestsForOwner(member.id),
    listBookingsForBorrower(member.id),
    listToolsOwnedBy(member.id),
  ]);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your dashboard</h1>
          <p className="text-stone-600">
            You lend {countLabel(myTools.length, "tool")}.{" "}
            <Link href="/dashboard/history" className="underline">
              See your history
            </Link>
          </p>
        </div>
        <Link href="/tools/new" className={primaryButtonStyle}>
          Add a tool
        </Link>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Requests and loans for your tools</h2>
        <ReservationList
          reservations={requests}
          memberId={member.id}
          showBorrower
          emptyText="Nobody has asked for your tools yet."
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Tools you are borrowing</h2>
        <ReservationList
          reservations={bookings}
          memberId={member.id}
          showBorrower={false}
          emptyText="You have no bookings. Find something in the catalog."
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Your tools</h2>
        <OwnedToolList tools={myTools} />
      </section>
    </div>
  );
}
