"use server";

import { refresh } from "next/cache";
import { requireMember } from "@/lib/current-member";
import { createReservation } from "@/lib/data/reservations";
import { findTool } from "@/lib/data/tools";
import { formatDateRange, todayIsoDate } from "@/lib/dates";
import {
  failedFormState,
  invalidFormState,
  succeededFormState,
  type FormState,
} from "@/lib/form-state";
import { canReserveTool } from "@/lib/permissions";
import { reservationSchema } from "@/lib/validation/reservation";

export async function reserveTool(
  toolId: number,
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const member = await requireMember(`/tools/${toolId}`);
  const tool = await findTool(toolId);
  if (!tool || !canReserveTool(member, tool)) {
    return failedFormState("You cannot book this tool.", formData);
  }

  const parsed = reservationSchema(todayIsoDate()).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalidFormState(parsed.error, formData);

  const { startDate, endDate } = parsed.data;
  const result = await createReservation({ toolId, borrowerId: member.id, startDate, endDate });
  refresh(); // either way the booked dates changed, so show the page's latest version

  if (!result.ok) {
    return failedFormState(
      "Sorry, someone has just booked some of those days. Please pick other dates.",
      formData,
    );
  }

  return succeededFormState(
    `Request sent. ${tool.ownerName} will see your booking for ${formatDateRange(startDate, endDate)}.`,
  );
}
