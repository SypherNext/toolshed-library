// Anything that can send an email. The reminder job only knows this shape, so tests can
// hand it a fake mailer and the real app hands it the SMTP one below.
import nodemailer from "nodemailer";
import { requireEnv } from "@/lib/env";

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export type Mailer = {
  send(message: EmailMessage): Promise<void>;
};

export function createSmtpMailer(): Mailer {
  const transport = nodemailer.createTransport({
    host: requireEnv("SMTP_HOST"),
    port: Number(requireEnv("SMTP_PORT")),
    secure: false, // Mailpit speaks plain SMTP; a real provider gives you its own settings
  });
  const from = requireEnv("MAIL_FROM");

  return {
    async send(message) {
      await transport.sendMail({ from, ...message });
    },
  };
}
