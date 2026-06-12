import { existsSync } from "node:fs";
import { execSync } from "node:child_process";

if (!existsSync("prisma/schema.prisma")) {
  process.exit(0);
}

execSync("prisma generate", { stdio: "inherit" });
