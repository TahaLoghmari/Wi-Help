import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import checkFile from "eslint-plugin-check-file";
import importPlugin from "eslint-plugin-import";
import reactHooksPlugin from "eslint-plugin-react-hooks";

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
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      // ── React Hooks ────────────────────────────────────────────────
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

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
          zones: [
            // ── Forbid cross-feature imports ───────────────────────
            {
              target: "./src/features/auth",
              from: "./src/features",
              except: ["./auth"],
              message:
                "Cross-feature imports are forbidden. Import from shared modules or compose at the app level.",
            },
            {
              target: "./src/features/appointments",
              from: "./src/features",
              except: ["./appointments"],
              message:
                "Cross-feature imports are forbidden. Import from shared modules or compose at the app level.",
            },
            {
              target: "./src/features/professionals",
              from: "./src/features",
              except: ["./professionals"],
              message:
                "Cross-feature imports are forbidden. Import from shared modules or compose at the app level.",
            },
            {
              target: "./src/features/patients",
              from: "./src/features",
              except: ["./patients"],
              message:
                "Cross-feature imports are forbidden. Import from shared modules or compose at the app level.",
            },
            {
              target: "./src/features/notifications",
              from: "./src/features",
              except: ["./notifications"],
              message:
                "Cross-feature imports are forbidden. Import from shared modules or compose at the app level.",
            },
            {
              target: "./src/features/messaging",
              from: "./src/features",
              except: ["./messaging"],
              message:
                "Cross-feature imports are forbidden. Import from shared modules or compose at the app level.",
            },
            {
              target: "./src/features/reviews",
              from: "./src/features",
              except: ["./reviews"],
              message:
                "Cross-feature imports are forbidden. Import from shared modules or compose at the app level.",
            },

            // ── Enforce unidirectional codebase ────────────────────
            // features cannot import from app
            {
              target: "./src/features",
              from: "./src/app",
              message:
                "Features cannot import from the app layer. Flow: shared → features → app.",
            },
            // shared modules cannot import from features or app
            {
              target: [
                "./src/components",
                "./src/hooks",
                "./src/lib",
                "./src/types",
                "./src/config",
                "./src/providers",
                "./src/locales",
              ],
              from: ["./src/features", "./src/app"],
              message:
                "Shared modules cannot import from features or the app layer. Flow: shared → features → app.",
            },
          ],
        },
      ],
    },
  },
];
