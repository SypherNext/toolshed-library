// Better Auth: sign-up, login, sessions and password hashing, stored in our own PostgreSQL.
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import { accounts, members, sessions, verifications } from "@/lib/db/schema";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/lib/validation/auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    // Better Auth's model names on the left, our tables on the right.
    schema: { user: members, session: sessions, account: accounts, verification: verifications },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: PASSWORD_MIN_LENGTH,
    maxPasswordLength: PASSWORD_MAX_LENGTH,
  },
  // nextCookies must stay last: it lets Server Actions set the session cookie.
  plugins: [nextCookies()],
});
