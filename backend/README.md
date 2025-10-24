🧩 1. Directory.Build.props

Purpose:
Used to define common MSBuild properties that you want to apply to all projects in a solution (or a folder tree).

Think of it as:

“A shared configuration file for build settings.”

Typical usage examples:

- Setting common TargetFramework
- Enforcing LangVersion
- Setting Nullable, ImplicitUsings
- Setting output paths, warnings, versioning info, etc.

Example:
```
<Project>
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <LangVersion>latest</LangVersion>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
</Project>
```
✅ Automatically applies to all projects in the same directory or subdirectories.
✅ You can override values in a project’s own .csproj if needed.

📦 2. Directory.Packages.props

Purpose:
Used specifically for centralized NuGet package version management — also called Central Package Management (CPM).

Think of it as:

“A single place to manage all NuGet package versions for the whole solution.”

Typical usage examples:
- Define package versions in one file instead of repeating them in each .csproj.
- Avoid version mismatches and simplify updates.

Example:
```
<Project>
  <ItemGroup>
    <!-- Define package versions -->
    <PackageVersion Include="Newtonsoft.Json" Version="13.0.3" />
    <PackageVersion Include="Serilog" Version="3.1.1" />
  </ItemGroup>
</Project>
```

Then in your .csproj, you just reference packages without a version:
```
<ItemGroup>
  <PackageReference Include="Newtonsoft.Json" />
  <PackageReference Include="Serilog" />
</ItemGroup>
```


✅ Keeps versions consistent across all projects.

✅ Makes upgrading a package across the entire solution a one-line change.

🔗 3. Using Them Together

You almost always use both:

Directory.Build.props → for build and project configuration

Directory.Packages.props → for NuGet package version control

They live side by side at the root of your solution (e.g., same folder as your .sln).

🧩 Add a package globally to all projects via Directory.Build.props

If you want every project in the solution to automatically reference a NuGet package (like Serilog, Microsoft.Extensions.Logging, etc.),
you can include it directly inside Directory.Build.props.

Example — Directory.Build.props:
```
<Project>
  <ItemGroup>
    <PackageReference Include="Serilog" />
  </ItemGroup>
</Project>
```

Then, if you’re using central package management, the version should be declared in Directory.Packages.props:

Directory.Packages.props:
```
<Project>
  <ItemGroup>
    <PackageVersion Include="Serilog" Version="3.1.1" />
  </ItemGroup>
</Project>
```

✅ All projects under that directory automatically reference Serilog.

✅ You only manage the version in one place (Directory.Packages.props).

✅ Individual projects can still remove or override the reference if needed.

Services Registration : 

backend.Host (Composition Root):

Handles application-level infrastructure that the entire app needs:

✅ Registers app-wide services: JWT Authentication/Authorization, Serilog, CORS, Swagger, Health checks

✅ Registers infrastructure that serves all modules: Hangfire server/dashboard (if used globally)

✅ Configures middleware pipeline

✅ Calls all module registration methods: AddCommonServices(), AddCarriersModule(), AddShipmentsModule(), etc.

✅ Orchestrates the entire application

Modules.Common:

Contains shared services used across multiple modules:

✅ Implements shared service interfaces and implementations (IDateTimeProvider, IEmailService, etc.)

✅ Registers external services used by multiple modules (e.g., SendGrid if all modules send emails)

✅ Provides registration extension method (AddCommonServices())

✅ Contains cross-cutting concerns (validation, logging abstractions, caching)

❌ Does NOT contain business logic specific to any module

Individual Modules (Carriers, Shipments, Stocks, Identity):

Each module is self-contained:

✅ Contains its own Domain, Features, Infrastructure, PublicApi

✅ Provides its own registration extension method (AddCarriersModule(), etc.)

✅ Registers its own dependencies (repositories, services, validators)

✅ Registers module-specific external services (e.g., Google Maps only in Shipments, Stripe only in payments module)

✅ Defines module-specific Hangfire jobs (if applicable)

✅ Completely independent - other modules interact only through PublicApi

Key Principle:
"Who uses it determines where it's registered"

Entire app → Host
Multiple modules → Common
One module → That module

Perfect — I can see your solution structure clearly from that screenshot. You’re using a **modular monolith with vertical slice architecture**, which is an excellent fit for your Wi-Help platform since each module can encapsulate its own domain logic, persistence, and APIs, while still running as a single deployable unit.

Let’s determine **which modules** you should create and how to structure them based on your business domains and flows (different registration, same login, role-based profiles, etc.).

---

## Recommended Module Structure

```
ModularMonolith.WiHelp/
├── Modules/
│   ├── Identity/              (Authentication & Core User Management)
│   │   ├── Modules.Identity.Domain
│   │   ├── Modules.Identity.Features
│   │   ├── Modules.Identity.Infrastructure
│   │   └── Modules.Identity.PublicApi
│   │
│   ├── Patients/              (Patient-specific functionality)
│   │   ├── Modules.Patients.Domain
│   │   ├── Modules.Patients.Features
│   │   ├── Modules.Patients.Infrastructure
│   │   └── Modules.Patients.PublicApi
│   │
│   ├── Professionals/         (Healthcare provider functionality)
│   │   ├── Modules.Professionals.Domain
│   │   ├── Modules.Professionals.Features
│   │   ├── Modules.Professionals.Infrastructure
│   │   └── Modules.Professionals.PublicApi
│   │
│   ├── Requests/              (Care request lifecycle)
│   │   ├── Modules.Requests.Domain
│   │   ├── Modules.Requests.Features
│   │   ├── Modules.Requests.Infrastructure
│   │   └── Modules.Requests.PublicApi
│   │
│   ├── Dispatch/              (AI/Algorithm matching & assignment)
│   │   ├── Modules.Dispatch.Domain
│   │   ├── Modules.Dispatch.Features
│   │   ├── Modules.Dispatch.Infrastructure
│   │   └── Modules.Dispatch.PublicApi
│   │
│   ├── Messaging/             (Real-time chat & communications)
│   │   ├── Modules.Messaging.Domain
│   │   ├── Modules.Messaging.Features
│   │   ├── Modules.Messaging.Infrastructure
│   │   └── Modules.Messaging.PublicApi
│   │
│   ├── Payments/              (Payment processing & transactions)
│   │   ├── Modules.Payments.Domain
│   │   ├── Modules.Payments.Features
│   │   ├── Modules.Payments.Infrastructure
│   │   └── Modules.Payments.PublicApi
│   │
│   ├── Reviews/               (Rating & quality system)
│   │   ├── Modules.Reviews.Domain
│   │   ├── Modules.Reviews.Features
│   │   ├── Modules.Reviews.Infrastructure
│   │   └── Modules.Reviews.PublicApi
│   │
│   ├── Notifications/         (Push, Email, SMS notifications)
│   │   ├── Modules.Notifications.Domain
│   │   ├── Modules.Notifications.Features
│   │   ├── Modules.Notifications.Infrastructure
│   │   └── Modules.Notifications.PublicApi
│   │
│   ├── Administration/        (Admin panel & platform management)
│   │   ├── Modules.Administration.Domain
│   │   ├── Modules.Administration.Features
│   │   ├── Modules.Administration.Infrastructure
│   │   └── Modules.Administration.PublicApi
│   │
│   └── Common/                (Shared kernel)
│       └── Modules.Common.Features
│
└── ModularMonolith.WiHelp.Host
```

## Module Responsibilities Breakdown

### 1. **Identity Module** (Core Authentication)
**Purpose**: Shared authentication and user account management

**Domain**:
- User entity (base for all user types)
- Role enum (Patient, Professional, Admin)
- JWT tokens, refresh tokens
- Password reset tokens

**Features**:
- Register user (with role selection)
- Login (shared for all user types)
- Logout
- Password reset flow
- Email/SMS OTP verification
- 2FA management
- Change password
- JWT token generation/validation

**Why separate**: All user types share the same login mechanism but need different registration flows

---

### 2. **Patients Module**
**Purpose**: Patient-specific profile and functionality

**Domain**:
- Patient profile entity
- Medical information (encrypted)
- Emergency contacts
- Favorite professionals list

**Features**:
- Complete patient registration (extends Identity registration)
- Update patient profile
- Manage medical information
- Add/remove favorite professionals
- View service history
- Download invoices/receipts

**PublicApi** (Events emitted):
- `PatientRegisteredEvent`
- `PatientProfileUpdatedEvent`

---

### 3. **Professionals Module**
**Purpose**: Healthcare provider profiles, verification, and availability

**Domain**:
- Professional profile entity
- Specialties/competencies
- Service area (geolocation)
- Availability schedule
- Verification documents
- Professional score/metrics

**Features**:
- Complete professional registration (extends Identity)
- Upload verification documents
- Update professional profile
- Manage availability calendar (weekly schedule, blocked dates)
- Set service area and rates
- Toggle online/offline status
- View earnings and statistics
- View own ratings

**PublicApi** (Events emitted):
- `ProfessionalRegisteredEvent` (triggers admin verification)
- `ProfessionalVerifiedEvent`
- `ProfessionalAvailabilityChangedEvent`
- `ProfessionalOnlineStatusChangedEvent`

---

### 4. **Requests Module**
**Purpose**: Care request creation and lifecycle management

**Domain**:
- Request entity (care type, location, timing, status)
- Assignment entity
- Request status state machine

**Features**:
- Create care request (by patient)
- View request details
- Update request status
- Cancel request (with business rules)
- View request history (filtered by user)
- Search/filter requests (for admin)

**PublicApi** (Events emitted):
- `RequestCreatedEvent` → triggers Dispatch module
- `RequestAcceptedEvent`
- `RequestStartedEvent`
- `RequestCompletedEvent`
- `RequestCancelledEvent`

**Dependencies**:
- Reads from: Patients.PublicApi, Professionals.PublicApi
- Listens to: Dispatch module events

---

### 5. **Dispatch Module**
**Purpose**: Intelligent matching and assignment of professionals to requests

**Domain**:
- Matching algorithm logic
- Professional scoring system
- Dispatch configuration (radius, timeout, weights)

**Features**:
- Match professionals to request (AI/algorithm)
- Rank eligible professionals
- Send assignment notifications
- Handle acceptance/rejection
- Timeout and reassignment logic
- Manual admin override for assignment
- Calculate distance and ETA (integrates with geo service)

**PublicApi** (Events emitted):
- `ProfessionalMatchedEvent`
- `AssignmentTimeoutEvent` (alert admin)

**Dependencies**:
- Listens to: `RequestCreatedEvent`
- Reads from: Professionals.PublicApi (availability, location, score)
- Calls: Notifications module

---

### 6. **Messaging Module**
**Purpose**: Real-time chat between patients and professionals

**Domain**:
- Message entity
- Conversation entity (linked to request/assignment)

**Features**:
- Send message (WebSocket via SignalR)
- Retrieve message history
- Mark messages as read
- Real-time message delivery

**PublicApi** (Events emitted):
- `NewMessageEvent` → triggers Notifications module

**Dependencies**:
- Reads from: Requests.PublicApi (to validate sender/receiver relationship)

---

### 7. **Payments Module**
**Purpose**: Payment processing, transactions, and financial management

**Domain**:
- Transaction entity
- Payment status
- Commission calculation
- Payout records

**Features**:
- Initiate payment (pre-authorization)
- Capture payment (after service completion)
- Process refund
- Handle payment webhooks (from Monétique/Stripe)
- Calculate commission
- Schedule payouts to professionals
- View transaction history

**PublicApi** (Events emitted):
- `PaymentAuthorizedEvent`
- `PaymentCompletedEvent`
- `RefundProcessedEvent`
- `PayoutScheduledEvent`

**Dependencies**:
- Listens to: `RequestCompletedEvent` (trigger payment capture)

---

### 8. **Reviews Module**
**Purpose**: Rating and quality control system

**Domain**:
- Review entity (patient → professional rating)
- Professional internal rating (professional → patient, admin-only)
- Review moderation

**Features**:
- Submit patient review (after service completion)
- Submit professional feedback (internal)
- View reviews (for professional profiles)
- Moderate reviews (admin)
- Delete inappropriate reviews
- Calculate professional score updates

**PublicApi** (Events emitted):
- `ReviewSubmittedEvent` → updates professional score
- `LowScoreAlertEvent` → alerts admin

**Dependencies**:
- Listens to: `RequestCompletedEvent`
- Updates: Professionals.PublicApi (score)

---

### 9. **Notifications Module**
**Purpose**: Multi-channel notification delivery

**Domain**:
- Notification entity (history)
- Notification templates
- Notification preferences (per user)

**Features**:
- Send push notification (Firebase)
- Send email (SendGrid/Mailjet)
- Send SMS (Twilio/D17)
- Store notification history
- Mark notifications as read
- Broadcast notifications (admin)

**PublicApi** (no events emitted, only consumed)

**Dependencies**:
- Listens to: Events from all modules that require notifications

---

### 10. **Administration Module**
**Purpose**: Admin panel functionality and platform management

**Domain**:
- Audit log entity
- Platform configuration
- Support ticket entity

**Features**:
- Verify professionals (approve/reject documents)
- Manage users (view, edit, suspend, delete)
- Manual request assignment
- Moderate reviews
- Manage payment disputes
- Configure platform settings (care types, commission rates)
- View analytics and generate reports
- Handle support tickets
- Broadcast communications

**PublicApi** (Events emitted):
- `ProfessionalVerifiedEvent`
- `UserSuspendedEvent`

**Dependencies**:
- Reads from: All modules (for monitoring and management)
- Can invoke: Most modules' public APIs for admin overrides

---

### 11. **Common Module** (Shared Kernel)
**Purpose**: Cross-cutting concerns and shared utilities

**Features**:
- Base entity classes
- Domain events infrastructure
- Result pattern implementation
- Validation helpers
- Geolocation utilities (distance calculation)
- File storage abstractions
- Encryption/decryption utilities
- Logging abstractions
- Exception handling

---

## Module Communication Strategy

### Direct API Calls (When Necessary)
- Use PublicApi projects for synchronous queries
- Example: Dispatch module calls `Professionals.PublicApi` to get available professionals
- Keep interfaces minimal and stable

### Shared Database (Monolith Approach)
- Each module has its own schema/table prefix
- Example: `Identity_Users`, `Patients_Profiles`, `Professionals_Availability`
- Use EF Core separate DbContexts per module for logical separation

---
