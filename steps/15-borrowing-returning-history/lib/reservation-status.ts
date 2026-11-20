// Every state a reservation can be in, from the borrower's request to the tool coming home.
export const reservationStatuses = [
  "requested",
  "approved",
  "declined",
  "cancelled",
  "on_loan",
  "returned",
] as const;

export type ReservationStatus = (typeof reservationStatuses)[number];

// These statuses hold the dates: nobody else can book the tool for the same days.
// The database constraint "reservations_no_overlap" uses the same list.
export const DATE_HOLDING_STATUSES: ReservationStatus[] = ["requested", "approved", "on_loan"];

// Finished reservations: they only appear in the history.
export const FINISHED_STATUSES: ReservationStatus[] = ["declined", "cancelled", "returned"];

export const statusLabels: Record<ReservationStatus, string> = {
  requested: "Waiting for the owner",
  approved: "Approved, not picked up yet",
  declined: "Declined",
  cancelled: "Cancelled",
  on_loan: "On loan",
  returned: "Returned",
};
