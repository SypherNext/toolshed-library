// The moves a reservation can make, who may make each one, and from which status.
// Plain data and functions, so the rules read like a table and are easy to test.
import type { ReservationStatus } from "@/lib/reservation-status";

type Role = "owner" | "borrower";

export const loanMoves = {
  approve: { label: "Approve", by: "owner", from: ["requested"], to: "approved" },
  decline: { label: "Decline", by: "owner", from: ["requested"], to: "declined" },
  handOver: { label: "Mark as handed over", by: "owner", from: ["approved"], to: "on_loan" },
  markReturned: { label: "Mark as returned", by: "owner", from: ["on_loan"], to: "returned" },
  cancel: { label: "Cancel booking", by: "borrower", from: ["requested", "approved"], to: "cancelled" },
} as const satisfies Record<string, { label: string; by: Role; from: ReservationStatus[]; to: ReservationStatus }>;

export type LoanMove = keyof typeof loanMoves;

export const loanMoveNames = Object.keys(loanMoves) as LoanMove[];

type ReservationParties = { status: ReservationStatus; borrowerId: string; ownerId: string };

function roleOf(memberId: string, reservation: ReservationParties): Role | null {
  if (memberId === reservation.ownerId) return "owner";
  if (memberId === reservation.borrowerId) return "borrower";
  return null;
}

export function canMakeMove(move: LoanMove, memberId: string, reservation: ReservationParties): boolean {
  // The move arrives from the browser, which can send any text: only real moves count.
  if (!Object.hasOwn(loanMoves, move)) return false;
  const rule = loanMoves[move];
  const allowedFrom: readonly ReservationStatus[] = rule.from;
  return roleOf(memberId, reservation) === rule.by && allowedFrom.includes(reservation.status);
}

export function availableMoves(memberId: string, reservation: ReservationParties): LoanMove[] {
  return loanMoveNames.filter((move) => canMakeMove(move, memberId, reservation));
}
