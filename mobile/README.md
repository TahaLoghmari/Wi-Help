# Wi-Help Mobile

Expo 55 and React Native 0.83 application using Expo Router, TanStack Query, NativeWind, and SignalR.

## Setup

Requirements: a supported Node.js/npm installation, an Android emulator or physical device (or macOS for iOS), and a running Wi-Help API.

```bash
cd mobile
npm ci
```

Set the API origin in `mobile/.env`:

```dotenv
EXPO_PUBLIC_API_URL=http://192.168.1.100:5000
```

`EXPO_PUBLIC_API_URL` is used for both HTTP requests and SignalR hubs. It must be reachable from the device or emulator; a physical device usually cannot reach the development machine through `localhost`. The current development fallback is defined in `src/config/env.ts`, but local setup should provide the correct origin explicitly. Expo public variables are embedded in the client, so never put secrets in them. Restart Expo after changing the value.

Start Metro with `npm start`, then choose a target, or run a target directly:

```bash
npm run android
npm run ios
npm run web
```

> **Do not run `npm run reset-project` as normal setup.** It is the destructive create-expo-app reset utility in `scripts/reset-project.js`; it moves or deletes `src/` and replaces the application with a blank scaffold.

## Commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start the Expo development server |
| `npm run android` | Start Expo and open Android |
| `npm run ios` | Start Expo and open iOS |
| `npm run web` | Start Expo for web |
| `npm run lint` | Lint `src/` with zero warnings allowed |
| `npm run lint:fix` | Apply ESLint fixes |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm test` | Run the Jest test suite |
| `npm run test:run` | Run Jest once, serially |
| `npm run test:e2e` | Run Maestro flows from `maestro/` |

## Project Map

```text
mobile/
├── assets/                  Images, icons, and fonts
├── maestro/                 Device-level Maestro flows
├── scripts/                 Tooling, including the destructive reset utility
└── src/
    ├── app/                 Expo Router route files and role layouts
    ├── app-composition/     Cross-feature and application-specific wiring
    ├── components/          Shared application UI and guards
    ├── config/              Environment, endpoint, route, and i18n configuration
    ├── entities/            Domain contracts, API access, queries, mutations, and caches
    ├── features/            User-facing capabilities and presentation
    ├── hooks/               Shared hooks
    ├── lib/                 HTTP, session, token storage, SignalR, and utilities
    ├── locales/             Translation resources
    ├── providers/           Query and realtime providers
    └── types/               Cross-cutting transport types
```

`@/` resolves to `src/`. Non-route files and folders use kebab-case; Expo Router filenames retain Router conventions such as `_layout.tsx`, route groups, and `[id].tsx`.

## Architecture

The dependency direction is:

```text
shared infrastructure -> entities -> features -> app / app-composition
```

- Shared code (`config`, `hooks`, `lib`, `types`, and `locales`) does not import domain, feature, or app code.
- Entities do not import features or composition and are isolated from sibling entities. `entities/location` is the foundational contract exception used by patient, professional, and session data.
- Features may consume entities and shared code, but may not import other features.
- Routes and `app-composition` may consume feature and entity public interfaces and perform final wiring.
- Shared application `components` and `providers` may consume entities, but not features or composition.

These constraints are encoded in `eslint.config.mjs`.

### Entity And Feature Ownership

An entity owns reusable domain data behavior: DTOs/contracts, endpoint calls, TanStack query keys, queries, mutations, invalidation, and cache transforms. Examples are `entities/appointment`, `entities/messaging`, and `entities/notification`.

A feature owns UI, presentation transforms, capability decisions, and user-facing orchestration. Features should call entity hooks instead of recreating server state and should expose semantic props rather than importing Expo Router.

Auth is the intentional workflow exception. `features/auth` owns login, logout, and multi-step registration request types and mutations because they are inputs to that user-facing workflow rather than reusable entity resources. It still uses the session entity's current-user cache, shared `Session` transport, and entity-owned lookup data.

### Public Interfaces

Each entity and feature exposes its supported surface through `src/entities/<entity>/index.ts` or `src/features/<feature>/index.ts`. App and composition code must import these barrels, for example `@/entities/appointment` or `@/features/reviews`, rather than reaching into internal files. Keep internal components, event decoders, and implementation helpers private unless another layer genuinely needs them.

### App Composition

`src/app/` should remain thin: read route parameters, enforce role layouts, convert semantic callbacks into navigation, and render a feature or composition component. `src/app-composition/` handles wiring that necessarily knows about multiple features or application policy:

- `profile-reviews.tsx` injects review UI and derives the viewer identity for patient and professional profiles.
- `professional-patients.ts` maps a patient messaging action to an existing conversation route.
- `authenticated-realtime-provider.tsx` selects authenticated realtime adapters, notification presentation, and related cache invalidation.

Do not solve cross-feature needs by importing one feature from another; add the smallest app-composition seam instead.

### Navigation And IDs

Feature screens expose intent-based callbacks such as `onOpenAppointment`, `onOpenConversation`, `onOpenPatient`, `onMessage`, and `onBack`. Route files own `router.push`, `router.replace`, and route constants from `src/config/routes.ts`.

Pass canonical backend IDs at these boundaries:

- Appointment detail routes receive `AppointmentDto.id`.
- Patient profile routes receive `PatientDto.id` or `AppointmentDto.patientId`, which are patient profile IDs.
- Conversation routes and messaging hub operations receive `ConversationDto.id`.
- `PatientDto.userId` and `ConversationDto.otherParticipantId` are user IDs; they are used to locate the canonical conversation, not as profile or conversation route IDs.

When a feature needs related metadata, pass the canonical ID and derive the object from entity data. Do not encode routing decisions or duplicate DTO snapshots inside feature UI.

### Session And Realtime

`src/lib/session.ts` is the unified authentication transport seam. The HTTP client (`src/lib/api-client.ts`) and SignalR service (`src/lib/signalr/signalr-service.ts`) both use the same `Session` for access-token reads and refresh. Login stores tokens through it; logout clears it and the query cache. The default storage adapter is Expo SecureStore via `src/lib/token-storage.ts`.

Authenticated patient and professional layouts mount `AuthenticatedRealtimeProvider` inside `AuthGuard`. Once `useCurrentUser` resolves an authenticated user, `SignalRProvider` starts one chat adapter and one notification adapter for that user and stops both on cleanup. Feature adapters decode hub events and update their entity caches; app composition adds cross-domain notification invalidation and toast policy. Realtime transport remains behind `RealtimeHub`/adapter interfaces so event handling can be tested without a live hub.

## Testing

- Co-locate Jest tests as `*.test.ts` or `*.test.tsx` beside the behavior they cover.
- Use `@testing-library/react-native` for screens, callbacks, guards, and hooks; query by accessible role or visible text and drive interactions with `userEvent`.
- Give query and mutation tests their own `QueryClientProvider`, disable retries where relevant, and assert both API calls and canonical key invalidation.
- Test pure reducers, presentation projections, capability rules, and realtime event decoders without rendering.
- Inject boundaries such as `createSession` storage/fetch and `RealtimeHub` implementations rather than using network or SecureStore in unit tests.
- Keep route behavior in thin callbacks and test feature semantics independently. `maestro/welcome.yaml` covers the representative launch-to-login device flow.

Before submitting changes, run:

```bash
npm run lint
npm run typecheck
npm run test:run
```

## Representative Flows

**Login:** `LoginScreen` runs the auth workflow mutation, stores returned tokens through `Session`, and invalidates `sessionKeys.currentUser`. Guards then route by normalized role, and the authenticated layout starts realtime composition.

**Professional appointment:** `AppointmentsScreen` loads entity-owned appointment data and emits an appointment ID. The route opens `[id].tsx`; detail actions use entity mutations and invalidate list/detail keys. Opening the patient passes the canonical patient profile ID.

**Professional patient messaging:** `PatientsScreen` emits a `PatientDto`. App composition matches `patient.userId` to `conversation.otherParticipantId`; it opens the matching `conversation.id`, or returns to the messages list when no conversation exists.

**Profile reviews:** A profile feature renders profile data and calls its injected `renderReviews(profileId)` slot. `profile-reviews.tsx` supplies `ReviewsSection` with the subject profile ID and the current viewer's user/profile identity without creating a feature-to-feature dependency.

**Authenticated notification:** The notification adapter validates an incoming hub event, invalidates notification keys, and displays a toast. Authenticated app composition then invalidates appointment, conversation, and review caches according to the notification role.
