// A list of reservations with the buttons the current member may press on each one.
import { changeReservation } from "@/app/dashboard/actions";
import type { ReservationView } from "@/lib/data/reservations";
import { formatDateRange } from "@/lib/dates";
import { availableMoves, loanMoves } from "@/lib/loan-rules";
import { statusLabels } from "@/lib/reservation-status";

type ReservationListProps = {
  reservations: ReservationView[];
  memberId: string;
  emptyText: string;
  showBorrower: boolean;
};

export function ReservationList({ reservations, memberId, emptyText, showBorrower }: ReservationListProps) {
  if (reservations.length === 0) return <p className="text-sm text-stone-600">{emptyText}</p>;

  return (
    <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
      {reservations.map((reservation) => (
        <li key={reservation.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="font-medium">
              {reservation.toolName}
              <span className="font-normal text-stone-600">
                {showBorrower ? `, for ${reservation.borrowerName}` : `, from ${reservation.ownerName}`}
              </span>
            </p>
            <p className="text-sm text-stone-600">
              {formatDateRange(reservation.startDate, reservation.endDate)} · {statusLabels[reservation.status]}
            </p>
          </div>
          <div className="flex gap-2">
            {availableMoves(memberId, reservation).map((move) => (
              <form key={move} action={changeReservation.bind(null, reservation.id, move)}>
                <button
                  type="submit"
                  className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm hover:bg-stone-100"
                >
                  {loanMoves[move].label}
                </button>
              </form>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
