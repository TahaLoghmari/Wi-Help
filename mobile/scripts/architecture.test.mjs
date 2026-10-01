import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";
import { ESLint } from "eslint";

const root = fileURLToPath(new URL("../", import.meta.url));
const eslint = new ESLint({ cwd: root });

test("dependency rules allow public contracts and reject reversed/deep dependencies", async () => {
  const cases = [
    [
      "src/features/auth/screens/boundary-probe.tsx",
      "@/features/patients/api",
      false,
    ],
    [
      "src/features/auth/screens/boundary-probe.tsx",
      "@/features/patients/api/get-relationships",
      true,
    ],
    [
      "src/features/appointments/screens/boundary-probe.tsx",
      "@/features/auth/session",
      false,
    ],
    [
      "src/features/appointments/screens/boundary-probe.tsx",
      "@/features/auth/api/use-current-user",
      true,
    ],
    [
      "src/features/patients/screens/boundary-probe.tsx",
      "@/features/messaging/api",
      true,
    ],
    ["src/shared/lib/boundary-probe.ts", "@/features/auth/session", true],
    ["src/shared/ui/boundary-probe.tsx", "@/providers/react-query", true],
    [
      "src/features/auth/screens/boundary-probe.tsx",
      "@/providers/react-query",
      true,
    ],
    [
      "src/app-composition/boundary-probe.tsx",
      "@/features/patients/api",
      false,
    ],
    [
      "src/app-composition/boundary-probe.tsx",
      "@/features/patients/screens/patients-screen",
      true,
    ],
  ];
  for (const [filePath, specifier, forbidden] of cases) {
    const [result] = await eslint.lintText(
      `import * as contract from "${specifier}";\nexport { contract };\n`,
      { filePath },
    );
    const errors = result.messages.filter(({ ruleId }) =>
      ["import/no-restricted-paths", "no-restricted-imports"].includes(ruleId),
    );
    assert.equal(
      errors.length > 0,
      forbidden,
      `${filePath} → ${specifier}: ${JSON.stringify(result.messages)}`,
    );
  }
});

test("all first-party files have a final migration decision", () => {
  const record = readFileSync(
    path.join(root, "architecture-refactor.md"),
    "utf8",
  );
  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (
        ["node_modules", ".expo", "dist", "build", ".git"].includes(entry.name)
      )
        continue;
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(file);
        continue;
      }
      const relative = path.relative(root, file);
      if (["expo-env.d.ts", "architecture-refactor.md"].includes(relative))
        continue;
      assert.ok(
        record.includes(`\`${relative}\``),
        `Missing ownership decision: ${relative}`,
      );
    }
  }
  visit(root);
  for (const [, original, destination] of record.matchAll(
    /^\| `([^`]+)` \| `([^`]+)`/gm,
  )) {
    assert.ok(existsSync(path.join(root, destination)), `Missing destination: ${destination}`);
    if (original !== destination) {
      assert.ok(!existsSync(path.join(root, original)), `Obsolete path remains: ${original}`);
    }
  }
  assert.ok(
    !/\| planned \|/.test(record),
    "Migration inventory still contains planned rows",
  );
});
