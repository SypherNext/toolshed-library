import { execSync } from "node:child_process";

// Every run starts from the same members, tools and loans.
export default function globalSetup() {
  execSync("npm run db:seed", { stdio: "inherit" });
}
