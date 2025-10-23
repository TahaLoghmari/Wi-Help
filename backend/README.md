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