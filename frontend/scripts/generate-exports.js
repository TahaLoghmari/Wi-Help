import { readdirSync, writeFileSync, existsSync, statSync } from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = join(__dirname, "../src/features");

if (!existsSync(srcDir)) {
  console.error(`❌ Source directory not found: ${srcDir}`);
  process.exit(1);
}

console.log(`📂 Generating exports for all index.ts files in: ${srcDir}`);

// Function to recursively find all index.ts files
function findIndexFiles(dir) {
  const results = [];
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    if (statSync(fullPath).isDirectory()) {
      results.push(...findIndexFiles(fullPath));
    } else if (item === "index.ts") {
      results.push(fullPath);
    }
  }
  return results;
}

// Get all index.ts files
const indexFiles = findIndexFiles(srcDir);

if (indexFiles.length === 0) {
  console.log("⚠️  No index.ts files found in src directory");
  process.exit(0);
}

// Process each index.ts file
indexFiles.forEach((indexPath) => {
  const targetDir = dirname(indexPath);

  console.log(`🔄 Processing: ${targetDir}`);

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
    console.log(
      `⚠️  No TypeScript/React files or folders found in ${targetDir}`,
    );
    return;
  }

  // Generate export statements
  const exports = allExports
    .map((name) => `export * from "./${name}";`)
    .join("\n");

  // Write to index.ts
  writeFileSync(indexPath, exports + "\n");

  console.log(
    `✅ Generated exports for ${files.length} files and ${folders.length} folders in ${targetDir}`,
  );
});

console.log(`📝 Updated ${indexFiles.length} index.ts files`);
