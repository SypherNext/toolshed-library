// Replace everything in the database with the fake members and tools from seed-data.ts.
import { hashPassword } from "better-auth/crypto";
import { sql } from "drizzle-orm";
import { db } from "../lib/db";
import { accounts, members, tools } from "../lib/db/schema";
import { SEED_PASSWORD, seedMembers, seedTools } from "./seed-data";

async function seed() {
  // Start from empty tables with ids counting from 1 again, so tool 1 is always the drill.
  // CASCADE also empties every table that points at members (sessions, accounts, ...).
  await db.execute(sql`TRUNCATE TABLE ${tools}, ${members} RESTART IDENTITY CASCADE`);

  await db.insert(members).values(seedMembers);

  // The same kind of account row Better Auth writes when someone signs up with a password.
  const passwordHash = await hashPassword(SEED_PASSWORD);
  await db.insert(accounts).values(
    seedMembers.map((member) => ({
      id: `account-${member.id}`,
      accountId: member.id,
      providerId: "credential",
      userId: member.id,
      password: passwordHash,
    })),
  );

  await db.insert(tools).values(
    seedTools.map(({ photo, ...tool }) => ({
      ...tool,
      photoUrl: `/seed-photos/${photo}.png`,
    })),
  );

  console.log(`Seeded ${seedMembers.length} members and ${seedTools.length} tools.`);
  console.log(`Every member logs in with the password "${SEED_PASSWORD}".`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$client.end());
