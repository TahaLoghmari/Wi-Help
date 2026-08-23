# Backend Modules

Active modules are Identity, Patients, Professionals, Appointments, Notifications,
Messaging, Reviews, and Administration. Common provides shared abstractions and
infrastructure. Dispatch and Payments are inactive scaffolds; do not add them to the
host or remove their projects as part of module cleanup.

Each module may contain these layers:

- `Domain`: entities, value objects, and domain rules.
- `Features`: commands, queries, endpoint implementations, and module registration.
- `Infrastructure`: persistence and external service implementations.
- `PublicApi`: contracts and interfaces used by other modules.

Project dependencies flow toward lower-level contracts: `Features` may reference its
own `Domain`, Common, and another module's `PublicApi` only.
`Infrastructure` may reference its own `Domain` and Common. `Domain` may reference
Common. `PublicApi` exposes only contracts and Common types. Do not reference another
module's `Domain`, `Features`, or `Infrastructure`.

The host explicitly registers active modules and supplies their feature assemblies to
`AddEndpoints`. `backend.Host.Extensions.EndpointExtensions` discovers concrete
`IEndpoint` implementations from those assemblies by reflection, registers them, and
maps them through `MapEndpoints`.

See [DEEPENING.md](DEEPENING.md) for the planned consolidation of the current
operation-level persistence ports.
