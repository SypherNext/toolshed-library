"use server";

import { notFound } from "next/navigation";
import { refresh } from "next/cache";
import { requireMember } from "@/lib/current-member";
import { applyLoanMove, findReservation } from "@/lib/data/reservations";
import { canMakeMove, type LoanMove } from "@/lib/loan-rules";

export async function changeReservation(reservationId: number, move: LoanMove) {
  const member = await requireMember("/dashboard");
  const reservation = await findReservation(reservationId);
  if (!reservation || !canMakeMove(move, member.id, reservation)) notFound();

  await applyLoanMove(reservationId, move);
  refresh();
}
