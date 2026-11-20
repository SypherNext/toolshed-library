// Called by the scheduler (see compose.yaml) once an hour. Anyone on the internet could
// call this address too, so it only works with the secret in the Authorization header.
import { reminderStore } from "@/lib/data/reminders";
import { todayIsoDate } from "@/lib/dates";
import { createSmtpMailer } from "@/lib/email/mailer";
import { requireEnv } from "@/lib/env";
import { sendOverdueReminders } from "@/lib/reminders";
import { secretsMatch } from "@/lib/secrets";

export async function POST(request: Request) {
  const given = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
  if (!secretsMatch(given, requireEnv("CRON_SECRET"))) {
    return Response.json({ error: "Not allowed" }, { status: 401 });
  }

  const result = await sendOverdueReminders({
    store: reminderStore,
    mailer: createSmtpMailer(),
    today: todayIsoDate(),
    appUrl: requireEnv("BETTER_AUTH_URL"),
  });
  return Response.json(result);
}
