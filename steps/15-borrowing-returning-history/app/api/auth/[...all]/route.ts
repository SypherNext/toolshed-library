// Better Auth's own endpoints (/api/auth/sign-in/email, /api/auth/get-session, ...).
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

export const { GET, POST } = toNextJsHandler(auth);
