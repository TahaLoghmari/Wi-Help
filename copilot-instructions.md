# Wi-Help — Copilot Instructions

## Project Overview

Wi-Help is a monorepo containing three projects that share the same domain:

| Folder      | Purpose                            | Stack                                 |
| ----------- | ---------------------------------- | ------------------------------------- |
| `/backend`  | REST API & business logic          | .NET / C# — modular monolith          |
| `/frontend` | Web application                    | React 18, TypeScript, Vite            |
| `/mobile`   | Mobile application (iOS & Android) | React Native, Expo SDK 55, TypeScript |

- `/frontend` and `/mobile` consume the **same** `/backend` API.
- Both client apps share the same folder conventions, state-management patterns, and API-client contract. The primary difference is the UI layer: the web app uses **shadcn/ui**, while the mobile app builds its **own reusable components** with **NativeWind (Tailwind CSS)**.

> **Mobile adaptation rule:** The mobile app mirrors the frontend's _organisation_ (feature modules, naming, state management, API client) but every implementation detail must follow **React Native and mobile development best practices**. Never blindly port a web pattern to mobile — always ask "is this idiomatic for React Native / Expo?". Concrete implications:
>
> - **Routing:** Use Expo Router's file-based system and its own navigation primitives (`Stack`, `Tabs`, `Drawer`, `useRouter`, `useLocalSearchParams`, etc.) — not any web-router concept.
> - **Navigation UX:** Follow mobile conventions: stack push/pop, bottom tabs, modal presentation, hardware back-button handling — not URL navigation or `<a>` links.
> - **Gestures & animations:** Use React Native Reanimated + React Native Gesture Handler for smooth 60/120 fps interactions — not CSS transitions.
> - **Keyboard & safe area:** Always handle `KeyboardAvoidingView`, `SafeAreaView`, and `useSafeAreaInsets` where needed.
> - **Lists:** Use `FlatList` or `FlashList` for scrollable data — never `Array.map` inside a plain `ScrollView` for long lists.
> - **Images:** Use Expo Image for optimised caching and lazy loading — not `<img>`.
> - **Storage:** Use `expo-secure-store` for sensitive data, `AsyncStorage` for non-sensitive — not `localStorage` or cookies.
> - **Permissions:** Use Expo permissions APIs (camera, location, notifications) with proper request flows.
> - **Platform differences:** Use `Platform.OS` checks or `.ios.ts` / `.android.ts` file splits when behaviour must differ per platform.
> - **Performance:** Avoid creating objects/functions inside render; memoize with `useMemo`/`useCallback`/`React.memo` when passing to lists or deeply nested trees.
> - **Styling:** Tailwind via NativeWind `className` is preferred, but `StyleSheet.create` is acceptable when NativeWind cannot express a style (e.g., shadows on Android, transforms).
>
> The frontend code in `/frontend` is a reference for _structure and logic_, not for copy-pasting implementation.

---

## Backend (`/backend`)

- .NET modular monolith following a clean-architecture style. Each domain lives in `/backend/Modules/{ModuleName}`.
- Do not change backend architecture unless explicitly requested.
- The API base URL is set via `VITE_API_URL` (web) or `EXPO_PUBLIC_API_URL` (mobile); default `http://localhost:5000`.

---

## Frontend (`/frontend`)

### Tech Stack

| Concern       | Library                                          |
| ------------- | ------------------------------------------------ |
| Framework     | React 18 + TypeScript (strict)                   |
| Build tool    | Vite 7                                           |
| Routing       | TanStack React Router v1 (file-based, type-safe) |
| Server state  | TanStack React Query v5                          |
| Client state  | Zustand v5                                       |
| Forms         | React Hook Form v7 + Zod v4                      |
| UI primitives | Radix UI + shadcn/ui                             |
| Styling       | Tailwind CSS v4                                  |
| i18n          | i18next + react-i18next                          |
| Real-time     | Microsoft SignalR                                |
| Icons         | Lucide React + Tabler Icons                      |
| Toasts        | Sonner                                           |
| Utilities     | clsx, tailwind-merge, CVA, date-fns              |

### Folder Structure

```
frontend/src/
├── api-client.ts          # Fetch-based HTTP client (auto token-refresh on 401)
├── index.ts               # Root barrel export
├── main.tsx               # Entry point
├── index.css              # Global Tailwind styles
├── config/
│   ├── endpoints.ts       # API_ENDPOINTS — all backend route constants
│   ├── env.ts             # VITE_* env vars (env.apiUrl, etc.)
│   ├── i18n.ts            # i18next bootstrap
│   ├── routes.ts          # ROUTE_PATHS — all frontend route constants
│   └── index.ts
├── lib/
│   ├── utils.ts           # cn(), toFormData(), toQueryString()
│   ├── id-crypto.ts       # UUID helper
│   ├── logger.ts          # Console wrapper
│   └── index.ts
├── types/
│   ├── enums.types.ts     # ProblemDetailsDto, PaginationResultDto<T>
│   ├── common.types.ts
│   └── index.ts
├── components/
│   ├── ui/                # shadcn-style reusable primitives
│   ├── Guards/            # GuestGuard, UserGuard, PatientGuard, ProfessionalGuard, AdminGuard
│   ├── errors/            # ErrorComponent, MainErrorFallback
│   ├── seo/               # <Head> component
│   └── index.ts
├── providers/
│   ├── AppProvider.tsx    # Composes all providers
│   ├── react-query.tsx    # QueryClient configuration
│   ├── react-router.tsx   # Router configuration
│   ├── SignalRProvider.tsx
│   └── index.ts
├── hooks/
│   ├── useAppNavigation.ts
│   ├── useCurrentScreenSize.ts
│   ├── useHandleApiError.tsx
│   └── index.ts
├── stores/                # Global Zustand stores (most stores live inside features/)
│   └── index.ts
├── routes/                # TanStack Router file routes
│   ├── __root.tsx
│   ├── index.tsx
│   ├── auth/
│   ├── patient/
│   ├── professional/
│   └── admin/
├── locales/
│   ├── en/translation.json
│   └── fr/translation.json
└── features/              # Domain feature modules (see Feature Module Pattern below)
    ├── auth/
    ├── patient/
    ├── professional/
    ├── admin/
    ├── dashboard/
    ├── messaging/
    ├── notifications/
    └── reviews/
```

---

## Mobile (`/mobile`)

### Tech Stack

| Concern      | Library                                         |
| ------------ | ----------------------------------------------- |
| Framework    | React Native + Expo SDK 55, TypeScript (strict) |
| Routing      | Expo Router v3 (file-based, typed routes)       |
| Server state | TanStack React Query v5                         |
| Client state | Zustand v5                                      |
| Forms        | React Hook Form v7 + Zod v4                     |
| Styling      | NativeWind v4 (Tailwind CSS for React Native)   |
| Animations   | React Native Reanimated v4                      |
| i18n         | i18next + react-i18next                         |
| Real-time    | (SignalR or Expo Notifications for push)        |
| Icons        | Expo Symbols / Ionicons / @expo/vector-icons    |
| Toasts       | react-native-toast-message or equivalent        |
| Utilities    | clsx, tailwind-merge                            |

> **UI Rule:** Do NOT use shadcn or Radix UI in mobile. Build every reusable component from scratch using NativeWind `className` props and React Native primitives (`View`, `Text`, `Pressable`, `TextInput`, `ScrollView`, `FlatList`, etc.).

### Folder Structure

```
mobile/src/
├── api-client.ts          # Fetch-based HTTP client — mirrors frontend (auto token-refresh)
├── global.css             # Tailwind directives
├── app/                   # Expo Router file-based routes (equivalent to frontend/routes/)
│   ├── _layout.tsx        # Root layout — mounts providers
│   ├── index.tsx          # Entry/redirect screen
│   ├── (auth)/            # Auth group (guest-only screens)
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── ...
│   ├── (patient)/         # Patient tab group
│   │   ├── _layout.tsx    # BottomTabs or Stack layout + PatientGuard
│   │   ├── appointments.tsx
│   │   ├── profile.tsx
│   │   └── ...
│   ├── (professional)/    # Professional tab group
│   └── (admin)/
├── components/
│   ├── ui/                # Custom reusable primitives (Button, Input, Card, Badge, etc.)
│   └── Guards/            # GuestGuard, UserGuard, PatientGuard, ProfessionalGuard
├── config/
│   ├── endpoints.ts       # API_ENDPOINTS — same as frontend (already exists)
│   ├── env.ts             # EXPO_PUBLIC_* env vars (already exists)
│   ├── i18n.ts            # i18next bootstrap (mirrors frontend)
│   └── routes.ts          # ROUTE_PATHS — Expo Router path constants
├── constants/             # App-wide constants (colors, sizes, etc.)
├── lib/
│   └── utils.ts           # cn(), toQueryString(), helpers
├── types/
│   ├── enums.types.ts     # ProblemDetailsDto, PaginationResultDto<T> (already exists)
│   └── common.types.ts
├── providers/
│   ├── AppProvider.tsx    # Composes all providers
│   └── react-query.tsx    # QueryClient configuration (already exists)
├── hooks/
│   ├── useAppNavigation.ts  # Centralized navigation helpers (Expo Router)
│   └── useHandleApiError.ts # Toast error handler
├── stores/                # Global Zustand stores (most stores live inside features/)
├── locales/
│   ├── en/translation.json
│   └── fr/translation.json
└── features/              # Domain feature modules — same structure as frontend
    ├── auth/
    ├── patient/
    ├── professional/
    ├── dashboard/
    ├── messaging/
    ├── notifications/
    └── reviews/
```

---

## Feature Module Pattern

> **Frontend** uses barrel `index.ts` files at every level for re-exports.
> **Mobile** does **not** use barrel files — import directly using `@/` path aliases.

Every feature folder follows this layout:

```
features/{feature-name}/
├── components/
│   ├── FeatureLayout.tsx       # (optional) shared layout for the feature
│   └── SubFeature/
│       └── SubFeaturePage.tsx  # Screen/page component
├── hooks/
│   └── useOperationName.ts    # one file per operation (no sub-folders needed in mobile)
├── stores/
│   └── useFeatureStore.ts
├── types/
│   └── api.types.ts           # DTOs — e.g. LoginUserDto, UserDto
└── lib/
    ├── validationSchemas.ts   # Zod schemas
    ├── formDefaults.ts        # Default values for forms
    └── constants.ts
```

### Auth Feature Example (Mobile)

```
features/auth/
├── components/
│   ├── Login/
│   │   └── LoginScreen.tsx      # Uses useLogin hook + loginFormSchema
│   └── Register/
│       ├── RegisterScreen.tsx
│       ├── PatientForm.tsx
│       └── ProfessionalForm.tsx
├── hooks/
│   ├── useLogin.ts
│   ├── useCurrentUser.ts
│   └── useRegisterPatient.ts
├── stores/
│   └── useRegisterRoleStore.ts
├── types/
│   └── api.types.ts             # UserDto, LoginUserDto, RegisterPatientDto, ...
└── lib/
    ├── authValidationSchemas.ts
    └── authFormDefaults.ts
```

---

## Naming Conventions

| Entity             | Convention               | Example                                             |
| ------------------ | ------------------------ | --------------------------------------------------- |
| Folders            | kebab-case               | `find-professional/`, `book-appointment/`           |
| Component files    | PascalCase               | `LoginScreen.tsx`, `AppointmentCard.tsx`            |
| Hook files         | camelCase prefixed `use` | `useLogin.ts`, `useCurrentUser.ts`                  |
| Store files        | `use{Name}Store`         | `useRegisterRoleStore.ts`                           |
| Type files         | `{name}.types.ts`        | `api.types.ts`, `enums.types.ts`                    |
| Lib files          | camelCase                | `validationSchemas.ts`, `formDefaults.ts`           |
| Constants          | `UPPER_SNAKE_CASE`       | `API_ENDPOINTS`, `ROUTE_PATHS`                      |
| React Query keys   | kebab-case string array  | `["current-user"]`, `["appointments"]`              |
| Types / Interfaces | PascalCase with suffix   | `UserDto`, `LoginUserDto`, `PaginationResultDto<T>` |
| Zustand stores     | `use{Name}Store` export  | `export const useAuthStore = create(...)`           |

---

## API Client

The `api-client.ts` in both `/frontend/src/` and `/mobile/src/` is a **custom fetch-based HTTP client** — no axios.

```typescript
// Usage pattern — identical in frontend and mobile
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { type UserDto } from "@/features/auth/types/api.types"; // mobile: always direct path, no barrel

// GET
const user = await api.get<UserDto>(API_ENDPOINTS.AUTH.CURRENT_USER);

// POST
await api.post<void>(API_ENDPOINTS.AUTH.LOGIN, credentials);

// PATCH
await api.patch<void>(API_ENDPOINTS.IDENTITY.UPDATE_LOCATION, body);

// DELETE
await api.delete<void>(API_ENDPOINTS.APPOINTMENTS.CANCEL(id));
```

**Key behaviours:**

- `credentials: "include"` — sends cookies automatically.
- Auto-retries once on HTTP 401 after refreshing the token via `API_ENDPOINTS.AUTH.REFRESH`.
- Throws `ProblemDetailsDto` on error — catch in `onError` of mutations.
- Auto-sets `Content-Type: application/json` for objects, handles `FormData` transparently.
- PATCH requests use `application/json-patch+json`.

---

## State Management

### Server State — TanStack React Query

```typescript
// Query hook (read)
export function useCurrentUser() {
  return useQuery<UserDto>({
    queryKey: ["current-user"],
    queryFn: () => api.get<UserDto>(API_ENDPOINTS.AUTH.CURRENT_USER),
  });
}

// Mutation hook (write)
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, LoginUserDto>({
    mutationFn: (credentials) =>
      api.post<void>(API_ENDPOINTS.AUTH.LOGIN, credentials),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error) => handleApiError(error),
  });
}
```

**QueryClient defaults** (already configured in `providers/react-query.tsx`):

- `staleTime`: 5 minutes
- `gcTime`: 10 minutes
- `refetchOnWindowFocus`: false
- `retry`: false

### Client State — Zustand

```typescript
// stores/useRegisterRoleStore.ts
import { create } from "zustand";

type Role = "patient" | "professional";

interface RegisterRoleStore {
  role: Role;
  setRole: (role: Role) => void;
}

export const useRegisterRoleStore = create<RegisterRoleStore>((set) => ({
  role: "patient",
  setRole: (role) => set({ role }),
}));
```

---

## Routing — Expo Router (Mobile)

Expo Router uses the filesystem under `src/app/`. Route groups `(name)` create layouts without affecting the URL.

```typescript
// src/app/(auth)/_layout.tsx — guest-only layout
import { Stack } from "expo-router";
import { GuestGuard } from "@/components/Guards";

export default function AuthLayout() {
  return (
    <GuestGuard>
      <Stack screenOptions={{ headerShown: false }} />
    </GuestGuard>
  );
}

// src/app/(patient)/_layout.tsx — authenticated tab layout
import { Tabs } from "expo-router";
import { UserGuard, PatientGuard } from "@/components/Guards";

export default function PatientLayout() {
  return (
    <UserGuard>
      <PatientGuard>
        <Tabs />
      </PatientGuard>
    </UserGuard>
  );
}
```

**Navigation hook** (`hooks/useAppNavigation.ts`):

```typescript
import { useRouter } from "expo-router";
import { ROUTE_PATHS } from "@/config/routes";

export function useAppNavigation() {
  const router = useRouter();
  return {
    goToLogin: () => router.replace(ROUTE_PATHS.AUTH.LOGIN),
    goToPatientHome: () => router.replace(ROUTE_PATHS.PATIENT.APPOINTMENTS),
    goBack: () => router.back(),
    // add more as needed
  };
}
```

**Route constants** (`config/routes.ts`):

```typescript
export const ROUTE_PATHS = {
  AUTH: {
    LOGIN: "/(auth)/login" as const,
    REGISTER: "/(auth)/register" as const,
  },
  PATIENT: {
    APPOINTMENTS: "/(patient)/appointments" as const,
    PROFILE: "/(patient)/profile" as const,
  },
  PROFESSIONAL: {
    DASHBOARD: "/(professional)/dashboard" as const,
  },
} as const;
```

---

## UI Components (Mobile) — Build Your Own

Do **not** use shadcn, Radix UI, or any desktop-UI library in `/mobile`.

Every primitive lives in `src/components/ui/` and is built with:

- React Native core primitives (`View`, `Text`, `Pressable`, `TextInput`, `ScrollView`, `FlatList`, `Image`, `Modal`)
- NativeWind `className` prop for styling
- **Class Variance Authority (CVA)** for variant-based styling
- `cn()` utility (`clsx` + `tailwind-merge`) for conditional classes

### `cn()` Utility (`lib/utils.ts`)

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Button Component Pattern

```typescript
// src/components/ui/Button.tsx
import { Pressable, Text, ActivityIndicator } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex-row items-center justify-center rounded-lg gap-2",
  {
    variants: {
      variant: {
        default: "bg-primary active:bg-primary/90",
        outline: "border border-primary bg-transparent",
        ghost: "bg-transparent",
        destructive: "bg-destructive active:bg-destructive/90",
      },
      size: {
        sm: "h-9 px-3",
        default: "h-11 px-4",
        lg: "h-14 px-6",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

const textVariants = cva("font-medium text-center", {
  variants: {
    variant: {
      default: "text-white",
      outline: "text-primary",
      ghost: "text-primary",
      destructive: "text-white",
    },
    size: { sm: "text-sm", default: "text-base", lg: "text-lg" },
  },
  defaultVariants: { variant: "default", size: "default" },
});

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  children: React.ReactNode;
}

export function Button({
  onPress,
  disabled,
  loading,
  variant,
  size,
  className,
  textClassName,
  children,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size }), disabled && "opacity-50", className)}
    >
      {loading && <ActivityIndicator size="small" color="white" />}
      <Text className={cn(textVariants({ variant, size }), textClassName)}>
        {children}
      </Text>
    </Pressable>
  );
}
```

### Input Component Pattern

```typescript
// src/components/ui/Input.tsx
import { TextInput, View, Text, type TextInputProps } from "react-native";
import { cn } from "@/lib/utils";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <View className="gap-1">
      {label && <Text className="text-sm font-medium text-foreground">{label}</Text>}
      <TextInput
        className={cn(
          "h-11 rounded-lg border border-input bg-background px-3 text-base text-foreground",
          "placeholder:text-muted-foreground",
          error && "border-destructive",
          className,
        )}
        placeholderTextColor="gray"
        {...props}
      />
      {error && <Text className="text-sm text-destructive">{error}</Text>}
    </View>
  );
}
```

### Card Component Pattern

```typescript
// src/components/ui/Card.tsx
import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("rounded-xl border border-border bg-card p-4 shadow-sm", className)}
      {...props}
    />
  );
}
```

### Import Rule — No Barrels in Mobile

**Never** create `index.ts` barrel files in the mobile project. Always import directly via the `@/` alias:

```typescript
// ✅ correct — direct absolute import
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { type UserDto } from "@/features/auth/types/api.types";
import { loginSchema } from "@/features/auth/lib/authValidationSchemas";

// ❌ wrong — no barrel imports
import { Button } from "@/components/ui";
import { useLogin } from "@/features/auth";
```

This avoids circular dependency issues common in React Native Metro bundler and keeps import chains explicit.

---

## Forms (Mobile)

Use **React Hook Form + Zod**, identical to the frontend pattern.

```typescript
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const loginSchema = z.object({
  email: z.email().min(1).max(256),
  password: z.string().min(6).max(100),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginScreen() {
  const { t } = useTranslation();
  const loginMutation = useLogin();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormValues) => loginMutation.mutate(data);

  return (
    <View className="flex-1 gap-4 p-4">
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t("common.email")}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      <Button onPress={handleSubmit(onSubmit)} loading={loginMutation.isPending}>
        {t("auth.login")}
      </Button>
    </View>
  );
}
```

---

## Internationalization (Mobile)

Mirror the frontend i18n setup using i18next + react-i18next.

```typescript
// src/config/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import en from "../locales/en/translation.json";
import fr from "../locales/fr/translation.json";

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, fr: { translation: fr } },
  lng: Localization.getLocales()[0]?.languageCode ?? "en",
  fallbackLng: "en",
  supportedLngs: ["en", "fr"],
  interpolation: { escapeValue: false },
});

export default i18n;
```

Usage in components:

```typescript
const { t } = useTranslation();
<Text>{t("auth.welcomeBack")}</Text>
```

---

## Error Handling

Errors from the API are of type `ProblemDetailsDto`. Handle in mutation `onError`:

```typescript
// src/hooks/useHandleApiError.ts
import Toast from "react-native-toast-message"; // or equivalent
import { useTranslation } from "react-i18next";
import { type ProblemDetailsDto } from "@/types/enums.types";

export function useHandleApiError() {
  const { t } = useTranslation();

  return function handleApiError(error: ProblemDetailsDto | Error | unknown) {
    if (error instanceof TypeError) {
      Toast.show({ type: "error", text1: t("errors.connectionError") });
    } else if (error && typeof error === "object" && "title" in error) {
      const problem = error as ProblemDetailsDto;
      Toast.show({
        type: "error",
        text1: problem.title,
        text2: problem.detail,
      });
    } else {
      Toast.show({ type: "error", text1: t("errors.unexpected") });
    }
  };
}
```

---

## Route Guards (Mobile)

Guards are thin wrapper components that check auth state and redirect.

```typescript
// src/components/Guards/UserGuard.tsx
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { ROUTE_PATHS } from "@/config/routes";

export function UserGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isPending } = useCurrentUser();

  useEffect(() => {
    if (!isPending && !user) {
      router.replace(ROUTE_PATHS.AUTH.LOGIN);
    }
  }, [user, isPending]);

  if (isPending || !user) return null;
  return <>{children}</>;
}
```

---

## Code Style Rules

1. **TypeScript strict mode** — no `any`, no implicit `any`. Use specific types or generics.
2. **No unused variables** — `noUnusedLocals: true`, `noUnusedParameters: true`.
3. **Named exports only** — avoid default exports for components and hooks. Exception: Expo Router screen files _must_ use default exports.
4. **No barrel `index.ts` files in mobile** — import directly via `@/` path aliases (e.g. `import { useLogin } from "@/features/auth/hooks/useLogin"`). This is a hard rule specific to `/mobile` — the Metro bundler is sensitive to circular re-exports.
5. **`cn()` for all className composition** — never concatenate class strings manually.
6. **CVA for variant-based components** — use `cva()` when a component has more than one visual variant.
7. **One concern per file** — one component per `.tsx`, one hook per `.ts`, one store per `.ts`.
8. **Hooks call API, components call hooks** — never call `api.*` directly inside a component.
9. **No magic strings** — all API paths from `API_ENDPOINTS`, all route paths from `ROUTE_PATHS`.
10. **Platform-aware code** — use `Platform.OS` or `.native.ts` / `.web.ts` split files when behaviour differs.
11. **Avoid inline styles** — use NativeWind `className` exclusively; `StyleSheet.create` only as a last resort.
12. **Accessibility** — every interactive element must have `accessibilityLabel` and `accessibilityRole` on interactive components.

---

## Adding a New Feature (Checklist)

1. Create `src/features/{name}/` with sub-folders: `components/`, `hooks/`, `stores/`, `types/`, `lib/`.
2. Define DTOs in `types/api.types.ts` — no `index.ts` barrel, import directly as `@/features/{name}/types/api.types`.
3. Add Zod validation schemas in `lib/validationSchemas.ts`.
4. Add form default values in `lib/formDefaults.ts`.
5. Implement hooks directly in `hooks/use{OperationName}.ts` — one file per operation, no sub-folders.
6. Implement Zustand stores (if client state needed) in `stores/use{Name}Store.ts`.
7. Build screen components in `components/{Subfolder}/{ScreenName}.tsx`.
8. Register route in `src/app/` (Expo Router creates routes from files).
9. Add `ROUTE_PATHS` entry in `config/routes.ts`.
10. Add translation keys to `locales/en/translation.json` and `locales/fr/translation.json`.
11. **Do not create any `index.ts` barrel files** — consumers import directly via `@/features/{name}/...`.

---

## Environment Variables

| Variable              | Platform | Purpose          |
| --------------------- | -------- | ---------------- |
| `EXPO_PUBLIC_API_URL` | Mobile   | Backend base URL |
| `VITE_API_URL`        | Web      | Backend base URL |

Access in mobile code:

```typescript
// src/config/env.ts
export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5000",
  isDev: __DEV__,
} as const;
```

---

## Path Aliases

Mobile `tsconfig.json` maps `@/*` to `./src/*` and `@/assets/*` to `./assets/*`. Always use `@/` imports — never relative `../` paths that cross feature boundaries.
