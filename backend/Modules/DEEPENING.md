# Module Port Deepening Plan

## Context

The module dependency policy now prevents `Features` from referencing
`Infrastructure`, keeps `PublicApi` contract-only, and keeps Host as the composition
root. The migration introduced operation-level persistence ports to preserve behavior.
Several are shallow one-to-one `DbContext` wrappers, so this document records the
next migration instead of adding more indirection now.

## Success Criteria

- A caller learns a capability, not the persistence steps required to implement it.
- A port accepts domain concepts or a small criteria value, never `IQueryable` or EF
  expressions.
- An adapter owns EF filtering, tracking, paging, and persistence mechanics.
- Tests exercise the existing HTTP seams. New internal seams are added only when a
  second adapter or a focused behavior test demonstrates a real variation.
- No generic `IRepository<T>` is introduced.

## Current Targets

### Appointments

`AppointmentsOperationPorts.cs` contains one store per command/query. Consolidate
ports that operate on the same aggregate into cohesive capabilities:

- An appointment workflow capability owns loading an appointment for an actor and
  committing its transition or prescription mutation.
- An appointment read capability owns patient/professional/admin pages and returns
  page data without exposing EF query construction.
- A scheduling capability owns booked-session overlap queries.

Do not make handlers call `GetAsync` followed by `SaveChangesAsync`. A workflow
operation should express the completed intent so transaction ownership is local to the
adapter or application capability.

### Reviews

Replace `IGetReviewsPort.GetAsync(Expression<Func<Review, bool>>, ...)` with a small
review-search criteria value. The review read capability should own filtering,
pagination, likes, replies, and query execution behind that interface. Keep review
authorization policy in Features unless it becomes a stable domain rule.

### Patients And Professionals

Group lookup catalogs, profile mutation, credentials/onboarding, and administrative
read models by capability. Avoid ports named after individual endpoint classes. A
module-facing profile capability is useful only when multiple callers need the same
operation; otherwise preserve the behavior beside its handler.

### Messaging

Retain `IMessageStatusUpdateStore` as the model: it represents a batch delivery
operation rather than individual EF calls. Consolidate message and conversation
operations around participant-authorized conversation behavior. Keep SignalR as a
transport adapter and keep participant authorization behind the existing conversation
access seam.

### Identity

Split `IIdentityUserOperations`, which mirrors `UserManager`, into cohesive account,
credentials, claims, and lockout capabilities. Return module results rather than
ASP.NET Identity `IdentityResult` where callers do not need framework details. This
requires deciding whether Identity remains framework-backed Domain code or gains a
separate framework-neutral account model; do not mix those choices incrementally.

## Deferred Behavior Decisions

Current cross-module workflows use best-effort side effects after or before local
persistence. Introducing an outbox, compensations, or distributed transactions would
change failure behavior and therefore requires an explicit product decision. Before
that work, define whether each notification, email, and conversation creation is
transactional, eventually consistent, or best effort.

Domain entities and token services still use wall-clock time in several paths. Before
changing them, approve deterministic tests for the domain transition seams (appointment
state changes, token expiry, message delivery/read state, and coordinate staleness).
Use the existing `TimeProvider` pattern rather than static time access once those seams
are approved.

## Recommended Order

1. Add behavior tests for one capability before deepening it.
2. Replace its shallow ports and adapter together, preserving the HTTP test.
3. Remove the old operation ports in the same change.
4. Repeat one module capability at a time, starting with review reads and appointment
   workflows.
