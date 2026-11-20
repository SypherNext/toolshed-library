import type { Metadata } from "next";
import { requireMember } from "@/lib/current-member";
import { listHistory } from "@/lib/data/reservations";
import { formatDateRange } from "@/lib/dates";
import { statusLabels } from "@/lib/reservation-status";

export const metadata: Metadata = {
  title: "History",
};

export default async function HistoryPage() {
  const member = await requireMember("/dashboard/history");
  const history = await listHistory(member.id);

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Your loan history</h1>
      {history.length === 0 ? (
        <p className="text-stone-600">Nothing yet. Finished loans appear here.</p>
      ) : (
        <table className="w-full overflow-hidden rounded-lg border border-stone-200 bg-white text-left text-sm">
          <thead className="bg-stone-100 text-stone-600">
            <tr>
              <th className="px-4 py-2">Tool</th>
              <th className="px-4 py-2">Dates</th>
              <th className="px-4 py-2">You were</th>
              <th className="px-4 py-2">Other member</th>
              <th className="px-4 py-2">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {history.map((loan) => {
              const lent = loan.ownerId === member.id;
              return (
                <tr key={loan.id}>
                  <td className="px-4 py-2 font-medium">{loan.toolName}</td>
                  <td className="px-4 py-2">{formatDateRange(loan.startDate, loan.endDate)}</td>
                  <td className="px-4 py-2">{lent ? "Lending" : "Borrowing"}</td>
                  <td className="px-4 py-2">{lent ? loan.borrowerName : loan.ownerName}</td>
                  <td className="px-4 py-2">{statusLabels[loan.status]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
