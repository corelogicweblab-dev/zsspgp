import { copyFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const webAdminRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(webAdminRoot, "..", "governorannhofer1.png");
const target = join(webAdminRoot, "public", "governorannhofer1.png");

if (!existsSync(source)) {
  console.error("Missing source file:", source);
  console.error("Place governorannhofer1.png in the repo root, then run again.");
  process.exit(1);
}

copyFileSync(source, target);
console.log("Synced", source, "->", target);
console.log("Bump GOVERNOR_IMAGE_VERSION in src/lib/governor-profile.ts so browsers load the new image.");
