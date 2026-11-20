// Who is using Toolshed right now? Pages and actions only ever ask these two functions.
import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { loginPath } from "@/lib/redirects";

export type CurrentMember = {
  id: string;
  name: string;
};

// cache() makes every component in one page render share a single session lookup.
export const getCurrentMember = cache(async (): Promise<CurrentMember | null> => {
  // A session check reads the clock (has it expired?), so it only runs for a real visitor,
  // never while Next.js prerenders a page ahead of time.
  await connection();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return { id: session.user.id, name: session.user.name };
});

export async function requireMember(returnTo = "/tools"): Promise<CurrentMember> {
  const member = await getCurrentMember();
  if (!member) redirect(loginPath(returnTo));
  return member;
}
