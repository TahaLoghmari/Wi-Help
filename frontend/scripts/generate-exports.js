import { readdirSync, writeFileSync, existsSync, statSync } from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const folderArg = process.argv[2];
const targetDir = folderArg
  ? resolve(process.cwd(), folderArg)
  : join(__dirname, "../src/components/ui");

if (!existsSync(targetDir)) {
  console.error(`❌ Directory not found: ${targetDir}`);
  process.exit(1);
}

console.log(`📂 Generating exports for: ${targetDir}`);

// Get all items in directory
const items = readdirSync(targetDir);

// Separate files and folders
const files = items
  .filter((item) => {
    const itemPath = join(targetDir, item);
    const isFile = statSync(itemPath).isFile();
    return (
      isFile &&
      (item.endsWith(".tsx") || item.endsWith(".ts")) &&
      item !== "index.ts"
    );
  })
  .map((file) => file.replace(/\.(tsx|ts)$/, ""))
  .sort();

// Get folders (directories)
const folders = items
  .filter((item) => {
    const itemPath = join(targetDir, item);
    return statSync(itemPath).isDirectory();
  })
  .sort();

// Combine files and folders
const allExports = [...files, ...folders];

if (allExports.length === 0) {
  console.log("⚠️  No TypeScript/React files or folders found to export");
  process.exit(0);
}

// Generate export statements
const exports = allExports
  .map((name) => `export * from "./${name}";`)
  .join("\n");

// Write to index.ts
const indexPath = join(targetDir, "index.ts");
writeFileSync(indexPath, exports + "\n");

console.log(
  `✅ Generated exports for ${files.length} files and ${folders.length} folders`
);
console.log(`📝 Updated: ${indexPath}`);
