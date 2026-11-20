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
