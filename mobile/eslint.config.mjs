import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import checkFile from "eslint-plugin-check-file";
import importPlugin from "eslint-plugin-import";
import reactHooksPlugin from "eslint-plugin-react-hooks";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

function childDirectoryNames(relativePath) {
  return readdirSync(new URL(relativePath, import.meta.url), {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

// Narrow, acyclic data contracts justified by registration and session identity.
const featureContracts = {
  auth: ["./patients/api/index.ts", "./professionals/api/index.ts"],
  appointments: ["./auth/session.ts"],
  messaging: ["./auth/session.ts"],
};

const featureIsolationZones = childDirectoryNames("./src/features/").map(
  (feature) => ({
    target: `./src/features/${feature}`,
    from: "./src/features",
    except: [`./${feature}`, ...(featureContracts[feature] ?? [])],
    message:
      "Use shared modules or app composition; only documented public feature contracts are allowed.",
  }),
);

export default [
  {
    ignores: [
      "node_modules/**",
      ".expo/**",
      "babel.config.js",
      "metro.config.js",
      "tailwind.config.js",
      "scripts/**",
    ],
  },

  // ── TypeScript base ──────────────────────────────────────────────────
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "check-file": checkFile,
      import: importPlugin,
      "react-hooks": reactHooksPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: fileURLToPath(new URL("./tsconfig.json", import.meta.url)),
        },
      },
    },
    rules: {
      // ── React Hooks ────────────────────────────────────────────────
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      "import/no-cycle": ["error", { ignoreExternal: true }],

      // ── TypeScript ─────────────────────────────────────────────────
      "@typescript-eslint/no-explicit-any": "warn",

      // ── File & Folder Naming (kebab-case) ──────────────────────────
      // Applies to all TS/TSX files EXCEPT Expo Router's app/ directory
      // (which uses special conventions: _layout.tsx, [id].tsx, +not-found.tsx)
      "check-file/filename-naming-convention": [
        "error",
        {
          "src/!(app)/**/*.{ts,tsx}": "KEBAB_CASE",
          "src/*.{ts,tsx}": "KEBAB_CASE",
        },
        { ignoreMiddleExtensions: true },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          // Apply only outside app/ — Expo Router uses (groups) which are valid
          "src/!(app)/**/!(__tests__)": "KEBAB_CASE",
        },
      ],

      // ── Absolute Imports ───────────────────────────────────────────
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*"],
              message:
                "Relative parent imports are forbidden. Use absolute imports with @/ prefix.",
            },
          ],
        },
      ],

      // ── Cross-Feature & Unidirectional Architecture ────────────────
      "import/no-restricted-paths": [
        "error",
        {
          basePath: projectRoot,
          zones: [
            // ── Forbid cross-feature imports ───────────────────────
            ...featureIsolationZones,

            // ── Enforce unidirectional codebase ────────────────────
            // features cannot import from app
            {
              target: "./src/features",
              from: ["./src/app", "./src/app-composition", "./src/providers"],
              message:
                "Features cannot import from the app layer. Flow: shared → features → app.",
            },
            // shared modules cannot import from features or app
            {
              target: "./src/shared",
              from: [
                "./src/features",
                "./src/app",
                "./src/app-composition",
                "./src/providers",
              ],
              message:
                "Shared infrastructure cannot import domain or composition code.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "expo-router",
              message:
                "Shared hooks and UI expose semantic navigation callbacks; Expo Router belongs in app composition.",
            },
          ],
          patterns: [
            {
              group: ["../*"],
              message:
                "Relative parent imports are forbidden. Use absolute imports with @/ prefix.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "expo-router",
              message:
                "Features expose semantic navigation callbacks; Expo Router belongs in app composition.",
            },
          ],
          patterns: [
            {
              group: ["../*"],
              message:
                "Relative parent imports are forbidden. Use absolute imports with @/ prefix.",
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "src/app/**/*.{ts,tsx}",
      "src/app-composition/**/*.{ts,tsx}",
      "src/providers/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*"],
              message:
                "Relative parent imports are forbidden. Use absolute imports with @/ prefix.",
            },
            {
              group: [
                "@/features/*/*",
                "!@/features/*/api",
                "!@/features/auth/session",
                "!@/features/messaging/realtime",
              ],
              message:
                "Composition must import a feature's public interface from @/features/<feature>.",
            },
          ],
        },
      ],
    },
  },
];
