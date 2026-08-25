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
              except: ["./professionals", "./reviews/index.ts"],
              message:
                "Cross-feature imports are forbidden. Import from shared modules or compose at the app level.",
            },
            {
              target: "./src/features/patients",
              from: "./src/features",
              except: ["./patients", "./reviews/index.ts"],
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
              from: ["./src/app", "./src/app-composition"],
              message:
                "Features cannot import from the app layer. Flow: shared → features → app.",
            },
            // entities cannot depend on features or composition
            {
              target: "./src/entities",
              from: ["./src/features", "./src/app", "./src/app-composition"],
              message:
                "Entities cannot import feature or composition code. Flow: shared → entities → features → app.",
            },
            // entity dependencies are isolated, except for foundational location contracts
            {
              target: "./src/entities/appointment",
              from: "./src/entities",
              except: ["./appointment"],
              message: "Appointment cannot depend on sibling entities.",
            },
            {
              target: "./src/entities/messaging",
              from: "./src/entities",
              except: ["./messaging"],
              message: "Messaging cannot depend on sibling entities.",
            },
            {
              target: "./src/entities/notification",
              from: "./src/entities",
              except: ["./notification"],
              message: "Notification cannot depend on sibling entities.",
            },
            {
              target: "./src/entities/review",
              from: "./src/entities",
              except: ["./review"],
              message: "Review cannot depend on sibling entities.",
            },
            {
              target: "./src/entities/patient",
              from: "./src/entities",
              except: ["./patient", "./location"],
              message:
                "Patient can depend only on foundational location contracts.",
            },
            {
              target: "./src/entities/professional",
              from: "./src/entities",
              except: ["./professional", "./location"],
              message:
                "Professional can depend only on foundational location contracts.",
            },
            {
              target: "./src/entities/session",
              from: "./src/entities",
              except: ["./session", "./location"],
              message:
                "Session can depend only on foundational location contracts.",
            },
            {
              target: "./src/entities/location",
              from: "./src/entities",
              except: ["./location"],
              message: "Location cannot depend on sibling entities.",
            },
            // shared modules cannot import from features or app
            {
              target: [
                "./src/hooks",
                "./src/lib",
                "./src/types",
                "./src/config",
                "./src/locales",
              ],
              from: [
                "./src/entities",
                "./src/features",
                "./src/app",
                "./src/app-composition",
              ],
              message:
                "Shared infrastructure cannot import domain or composition code.",
            },
            // application UI/providers may consume entities, but not features or composition
            {
              target: ["./src/components", "./src/providers"],
              from: ["./src/features", "./src/app", "./src/app-composition"],
              message:
                "Application UI and providers cannot import feature or composition code.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/app/**/*.{ts,tsx}", "src/app-composition/**/*.{ts,tsx}"],
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
              group: ["@/features/*/*"],
              message:
                "Composition must import a feature's public interface from @/features/<feature>.",
            },
            {
              group: ["@/entities/*/*"],
              message:
                "Composition must import an entity's public interface from @/entities/<entity>.",
            },
          ],
        },
      ],
    },
  },
];
