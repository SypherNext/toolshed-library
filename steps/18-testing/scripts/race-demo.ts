// Two neighbours press "Request to borrow" for the same days at the same moment.
// Run it with: npm run demo:race   (it uses its own scratch tables and removes them afterwards)
import { Pool, type PoolClient } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const PAUSE_SECONDS = 0.2; // the gap between "check" and "insert" where the race happens

type Attempt = { borrower: string; saved: boolean; detail: string };

// The tempting version: look for an overlapping booking first, insert if there is none.
async function checkThenInsert(client: PoolClient, table: string, borrower: string): Promise<Attempt> {
  const overlap = await client.query(
    `SELECT 1 FROM ${table} WHERE tool_id = 1 AND daterange(start_date, end_date, '[]') && daterange('2026-11-14', '2026-11-15', '[]')`,
  );
  if (overlap.rowCount) return { borrower, saved: false, detail: "check said the days were taken" };
  await client.query(`SELECT pg_sleep(${PAUSE_SECONDS})`);
  try {
    await client.query(
      `INSERT INTO ${table} (tool_id, borrower, start_date, end_date) VALUES (1, $1, '2026-11-14', '2026-11-15')`,
      [borrower],
    );
    return { borrower, saved: true, detail: "inserted" };
  } catch (error) {
    const code = (error as { code?: string }).code;
    return { borrower, saved: false, detail: `database refused it (code ${code})` };
  }
}

async function race(table: string): Promise<Attempt[]> {
  const ben = await pool.connect();
  const chloe = await pool.connect();
  try {
    return await Promise.all([checkThenInsert(ben, table, "Ben"), checkThenInsert(chloe, table, "Chloe")]);
  } finally {
    ben.release();
    chloe.release();
  }
}

function report(title: string, attempts: Attempt[], rows: number) {
  console.log(title);
  for (const attempt of attempts) console.log(`  ${attempt.borrower}: ${attempt.detail}`);
  console.log(`  bookings saved for the same days: ${rows}`);
}

async function main() {
  const columns = "tool_id int NOT NULL, borrower text NOT NULL, start_date date NOT NULL, end_date date NOT NULL";
  await pool.query("CREATE EXTENSION IF NOT EXISTS btree_gist");
  await pool.query(`DROP TABLE IF EXISTS race_plain, race_guarded`);
  await pool.query(`CREATE TABLE race_plain (${columns})`);
  await pool.query(`CREATE TABLE race_guarded (${columns},
    EXCLUDE USING gist (tool_id WITH =, daterange(start_date, end_date, '[]') WITH &&))`);

  try {
    const plain = await race("race_plain");
    const plainRows = (await pool.query("SELECT count(*)::int AS n FROM race_plain")).rows[0].n;
    report("Without a constraint (check, then insert):", plain, plainRows);

    const guarded = await race("race_guarded");
    const guardedRows = (await pool.query("SELECT count(*)::int AS n FROM race_guarded")).rows[0].n;
    report("With the EXCLUDE constraint:", guarded, guardedRows);
  } finally {
    await pool.query(`DROP TABLE IF EXISTS race_plain, race_guarded`);
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
