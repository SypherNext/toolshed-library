// A reservation mentions two members: the tool's owner and the borrower. To join the
// members table twice in one query, each join needs its own name.
import { aliasedTable } from "drizzle-orm";
import { members } from "@/lib/db/schema";

export const owners = aliasedTable(members, "owners");
export const borrowers = aliasedTable(members, "borrowers");
