// Replace everything in the database with the fake members and tools from seed-data.ts.
import { sql } from "drizzle-orm";
import { db } from "../lib/db";
import { members, tools } from "../lib/db/schema";
import { seedMembers, seedTools } from "./seed-data";

async function seed() {
  // Start from empty tables with ids counting from 1 again, so tool 1 is always the drill.
  await db.execute(sql`TRUNCATE TABLE ${tools}, ${members} RESTART IDENTITY CASCADE`);

  await db.insert(members).values(seedMembers);
  await db.insert(tools).values(
    seedTools.map(({ photo, ...tool }) => ({
      ...tool,
      photoUrl: `/seed-photos/${photo}.png`,
    })),
  );

  console.log(`Seeded ${seedMembers.length} members and ${seedTools.length} tools.`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$client.end());
