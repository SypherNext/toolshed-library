// The words of the overdue reminder. A plain function: data in, email out.
import { daysInclusive, formatDay } from "@/lib/dates";
import type { EmailMessage } from "@/lib/email/mailer";

export type OverdueLoan = {
  reservationId: number;
  toolName: string;
  ownerName: string;
  borrowerName: string;
  borrowerEmail: string;
  endDate: string;
};

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (character) => `&#${character.charCodeAt(0)};`);
}

export function daysLate(endDate: string, today: string): number {
  return daysInclusive(endDate, today) - 1;
}

export function overdueReminderEmail(loan: OverdueLoan, today: string, appUrl: string): EmailMessage {
  const late = daysLate(loan.endDate, today);
  const dayWord = late === 1 ? "day" : "days";
  const dashboardUrl = `${appUrl}/dashboard`;
  const lines = [
    `Hi ${loan.borrowerName},`,
    `The ${loan.toolName} you borrowed from ${loan.ownerName} was due back on ${formatDay(loan.endDate)}, ${late} ${dayWord} ago.`,
    `Please return it, or message ${loan.ownerName} to agree a new day.`,
    `Your loans: ${dashboardUrl}`,
  ];

  return {
    to: loan.borrowerEmail,
    subject: `Reminder: please return the ${loan.toolName}`,
    text: lines.join("\n\n"),
    html: lines
      .slice(0, 3)
      .map((line) => `<p>${escapeHtml(line)}</p>`)
      .concat(`<p><a href="${escapeHtml(dashboardUrl)}">Open your Toolshed dashboard</a></p>`)
      .join("\n"),
  };
}
