# 🏗️ Architecture Guide - Complete Reference

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture Layers](#architecture-layers)
3. [Dependency Injection Explained](#dependency-injection-explained)
4. [Creating a Feature](#creating-a-feature)
5. [Best Practices](#best-practices)
6. [Quick Reference](#quick-reference)

---

## Overview

### What You're Using

**Architecture Type**: Modular Monolith with Vertical Slice Architecture + CQRS

**Key Concepts**:

- **Monolith**: Single deployable application
- **Modular**: Independent modules (Identity, Patients, Professionals, etc.)
- **Vertical Slice**: Each feature is self-contained (API → Business Logic → Database)
- **CQRS**: Separate Commands (write) and Queries (read)

### Module Structure

```
Modules/
├── Identity/
│   ├── Modules.Identity.Domain
│   ├── Modules.Identity.Features
│   ├── Modules.Identity.Infrastructure
│   └── Modules.Identity.PublicApi
└── Common/Modules.Common.Features
```

---

## Architecture Layers

### Dependency Flow (THE TRUTH)

```
Host → Features → Infrastructure → Domain
```

**✅ CORRECT**: Features depends on Infrastructure  
**✅ CORRECT**: Infrastructure depends on Domain  
**✅ CORRECT**: Domain has NO dependencies  
**❌ WRONG**: "Features must not depend on Infrastructure" (old idea)

### Layer Responsibilities

#### 1️⃣ Domain Layer

- **Contains**: Entities, Value Objects, Errors, Constants
- **Rules**: Zero dependencies, pure business logic
- **Example**: `User.Create()` method

#### 2️⃣ Features Layer

- **Contains**: Commands, Queries, Handlers, Validators, Endpoints
- **Rules**: Can depend on Infrastructure, contains business operations
- **Example**: `LoginCommandHandler` handles login logic

#### 3️⃣ Infrastructure Layer

- **Contains**: Services, Repositories, Database, External APIs
- **Rules**: Implements concrete services, handles data persistence
- **Example**: `TokenManagementService` creates JWT tokens

#### 4️⃣ Host Layer

- **Contains**: Program.cs, DI configuration, Middleware
- **Rules**: Orchestrates everything, registers services
- **Example**: Calls `AddIdentityInfrastructure()`

---

## Dependency Injection Explained

### How It Works

```
1. Infrastructure defines services
   └─> TokenManagementService.cs

2. Infrastructure registers services
   └─> DependencyInjection.cs: services.AddScoped<TokenManagementService>()

3. Host calls Infrastructure
   └─> builder.Services.AddIdentityInfrastructure(config)

4. Features uses via constructor injection
   └─> public LoginCommandHandler(TokenManagementService service)
```

### Service Registration Flow

**Infrastructure/DependencyInjection.cs:**

```csharp
public static IServiceCollection AddIdentityInfrastructure(
    this IServiceCollection services,
    IConfiguration configuration)
{
    // Register database
    services.AddDbContext<IdentityDbContext>(options =>
        options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

    // Register Identity services
    services.AddIdentity<User, IdentityRole<Guid>>()
        .AddEntityFrameworkStores<IdentityDbContext>()
        .AddDefaultTokenProviders();

    // Register YOUR custom services
    services.AddScoped<TokenManagementService>();
    services.AddScoped<TokenProvider>();

    // Configure settings
    services.Configure<JwtSettings>(configuration.GetSection("Jwt"));
    services.Configure<GoogleSettings>(configuration.GetSection("Google"));

    return services;
}
```

**Host/DependencyInjection.cs:**

```csharp
public static WebApplicationBuilder AddServices(this WebApplicationBuilder builder)
{
    // Register module infrastructure
    builder.Services.AddIdentityInfrastructure(builder.Configuration);

    // Auto-discover and register handlers
    builder.Services.AddCommonModule(moduleAssemblies);

    return builder;
}
```

### Key Rules

1. ✅ Services are DEFINED in Infrastructure
2. ✅ Services are REGISTERED in Infrastructure's DI
3. ✅ Host CALLS Infrastructure's DI method
4. ✅ Features USES services via constructor injection
5. ⚠️ **Current**: Using concrete classes (works fine)
6. ⚠️ **Best practice**: Use interfaces for better testability and flexibility

---

## Creating a Feature

### Step-by-Step: UpdateUserProfile Example

#### Step 1: Create Feature Folder

```
Modules.Identity.Features/
└── UserProfile/
    ├── UpdateProfile.cs
    ├── UpdateProfileCommand.cs
    ├── UpdateProfileCommandHandler.cs
    └── UpdateProfile.Validator.cs
```

#### Step 2: Define Command

```csharp
// UpdateProfileCommand.cs
public sealed record UpdateProfileCommand(
    string UserId,
    string FirstName,
    string LastName,
    string PhoneNumber
) : ICommand;
```

#### Step 3: Create Validator

```csharp
// UpdateProfile.Validator.cs
public sealed class UpdateProfileValidator : AbstractValidator<UpdateProfileCommand>
{
    public UpdateProfileValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(x => x.LastName)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(x => x.PhoneNumber)
            .NotEmpty()
            .Matches(@"^\d{10}$");
    }
}
```

#### Step 4: Implement Handler

```csharp
// UpdateProfileCommandHandler.cs
public sealed class UpdateProfileCommandHandler(
    UserManager<User> userManager,
    ILogger<UpdateProfileCommandHandler> logger)
    : ICommandHandler<UpdateProfileCommand>
{
    public async Task<Result> Handle(
        UpdateProfileCommand command,
        CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(command.UserId);

        if (user == null)
        {
            return Result.Failure(ProfileErrors.UserNotFound());
        }

        user.UpdateProfile(
            command.FirstName,
            command.LastName,
            command.PhoneNumber);

        var result = await userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            return Result.Failure(ProfileErrors.UpdateFailed());
        }

        return Result.Success();
    }
}
```

#### Step 5: Create Endpoint

```csharp
// UpdateProfile.cs
internal sealed class UpdateProfile : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("user/profile", async (
                Request request,
                ICommandHandler<UpdateProfileCommand> handler,
                IHttpContextAccessor httpContext,
                CancellationToken ct) =>
            {
                var userId = httpContext.HttpContext!.User.GetUserId();

                var command = new UpdateProfileCommand(
                    userId,
                    request.FirstName,
                    request.LastName,
                    request.PhoneNumber);

                Result result = await handler.Handle(command, ct);
                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .RequireAuthorization()
            .WithTags(Tags.UserManagement);
    }

    private sealed record Request(
        string FirstName,
        string LastName,
        string PhoneNumber);
}
```

✅ **Done!** System auto-registers everything.

---

## Best Practices

### 1. Use Interfaces for Services

⚠️ **CURRENT STATE**: Your code uses concrete classes

```csharp
public LoginCommandHandler(TokenManagementService service)
```

✅ **BEST PRACTICE**: Use interfaces

```csharp
// Define interface in Infrastructure/Abstractions/
public interface ITokenManagementService
{
    Task<AccessTokensDto> CreateAndStoreTokens(Guid userId, string email, CancellationToken ct);
}

// Implement in Infrastructure/Services/
public class TokenManagementService : ITokenManagementService { ... }

// Register in Infrastructure DI
services.AddScoped<ITokenManagementService, TokenManagementService>();

// Use interface in Features
public LoginCommandHandler(ITokenManagementService tokenService)
```

**Why**: Better testability, flexibility, follows SOLID principles  
**Note**: Current implementation works fine! Consider this for future refactoring.

### 2. Result Pattern for Errors

❌ **BAD**: Throwing exceptions for business logic

```csharp
if (user == null)
    throw new Exception("User not found");
```

✅ **GOOD**: Return Result

```csharp
if (user == null)
    return Result.Failure(LoginErrors.UserNotFound());
```

**Why**: Exceptions are for unexpected errors, Results are for expected failures

### 3. Keep Endpoints Thin

❌ **BAD**: Business logic in endpoint

```csharp
app.MapPost("login", async (Request request) =>
{
    var user = await FindUser(request.Email);
    if (user == null) return Results.BadRequest();
    // ... more logic ...
});
```

✅ **GOOD**: Endpoint delegates to handler

```csharp
app.MapPost("login", async (Request request, ICommandHandler<LoginCommand> handler, ...) =>
{
    var command = new LoginCommand(request.Email, request.Password);
    Result result = await handler.Handle(command, ct);
    return result.Match(() => Results.Ok(), CustomResults.Problem);
});
```

### 4. Validate in Validators

❌ **BAD**: Validation in handler

```csharp
public async Task<Result> Handle(Command cmd)
{
    if (string.IsNullOrEmpty(cmd.Email))
        return Result.Failure(Errors.InvalidEmail());
    // ...
}
```

✅ **GOOD**: Validation in validator

```csharp
// Validator.Validator.cs
public class CreateUserValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
    }
}
```

### 5. Use Domain Methods

❌ **BAD**: Logic in handler

```csharp
public async Task<Result> Handle(Command cmd)
{
    user.FirstName = cmd.FirstName;
    user.LastName = cmd.LastName;
    user.UpdatedAt = DateTime.UtcNow;
}
```

✅ **GOOD**: Logic in entity

```csharp
// In User.cs (Domain)
public void UpdateProfile(string firstName, string lastName, string phoneNumber)
{
    FirstName = firstName;
    LastName = lastName;
    PhoneNumber = phoneNumber;
    UpdatedAt = DateTime.UtcNow;
}
```

### 6. Module Communication

❌ **BAD**: Direct repository access

```csharp
public class DispatchHandler
{
    private readonly ProfessionalsRepository _repo; // Wrong!
}
```

✅ **GOOD**: Use PublicApi

```csharp
public class DispatchHandler
{
    private readonly IProfessionalsPublicApi _professionalsApi;

    public async Task<Result> Handle(Command cmd)
    {
        var professional = await _professionalsApi.GetAvailableAsync();
    }
}
```

### 7. Keep Features Self-Contained

All code for a feature should be in ONE folder:

```
Login/
├── Login.cs                 # Endpoint
├── LoginCommand.cs          # Input
├── LoginCommandHandler.cs   # Logic
└── Login.Validator.cs       # Validation
```

### 8. Settings Configuration

✅ **Location of settings**: Infrastructure  
✅ **Configuration**: Infrastructure's DI method  
✅ **Usage**: Host reads settings if needed for app-level config

**Example**:

```csharp
// Infrastructure/DependencyInjection.cs
public static IServiceCollection AddIdentityInfrastructure(...)
{
    // Configure settings
    services.Configure<JwtSettings>(configuration.GetSection("Jwt"));
    return services;
}

// Host can still read settings for JWT Bearer setup
public static WebApplicationBuilder AddAuthentication(...)
{
    var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>()!;
    builder.Services.AddJwtBearer(options => { /* use jwtSettings */ });
    return builder;
}
```

### 9. Auto-Discovery

Everything auto-registers:

✅ `ICommandHandler<T>` → Auto-registered  
✅ `IQueryHandler<T>` → Auto-registered  
✅ `IEndpoint` → Auto-discovered  
✅ `AbstractValidator<T>` → Auto-registered

Just follow the naming conventions!

### 10. Dependency Direction Summary

```
✅ Domain: NO dependencies
✅ Features: Can depend on Infrastructure and Domain
✅ Infrastructure: Can depend on Domain
✅ Host: Depends on all layers
❌ Domain: Must NOT depend on Features or Infrastructure
```

---

## Quick Reference

### Request Flow

```
HTTP Request
    ↓
IEndpoint (thin, just transforms request)
    ↓
ValidationDecorator (auto)
    ↓
LoggingDecorator (auto)
    ↓
Your Handler (business logic)
    ↓
Infrastructure Services (if needed)
    ↓
Returns Result<T>
    ↓
HTTP Response
```

### Handler Templates

**Command without response:**

```csharp
public sealed class MyCommandHandler(
    IMyService service,
    ILogger<MyCommandHandler> logger)
    : ICommandHandler<MyCommand>
{
    public async Task<Result> Handle(MyCommand cmd, CancellationToken ct)
    {
        // Your logic
        return Result.Success();
    }
}
```

**Command with response:**

```csharp
public sealed class MyCommandHandler(
    IMyService service)
    : ICommandHandler<MyCommand, MyResponse>
{
    public async Task<Result<MyResponse>> Handle(MyCommand cmd, CancellationToken ct)
    {
        var data = await service.DoSomething();
        return Result<MyResponse>.Success(new MyResponse(data));
    }
}
```

**Query:**

```csharp
public sealed class MyQueryHandler(
    IMyRepository repo)
    : IQueryHandler<MyQuery, MyResponse>
{
    public async Task<Result<MyResponse>> Handle(MyQuery query, CancellationToken ct)
    {
        var data = await repo.Get(query.Id);
        return Result<MyResponse>.Success(new MyResponse(data));
    }
}
```

### Common Mistakes

| ❌ Don't                            | ✅ Do Instead                   |
| ----------------------------------- | ------------------------------- |
| Throw exceptions for business logic | Use Result pattern              |
| Put business logic in endpoints     | Use handlers                    |
| Skip validation                     | Create validators               |
| Access other modules directly       | Use PublicApi                   |
| Put DTOs in Domain                  | DTOs in Infrastructure/Features |
| Mix layers                          | Keep them separate              |

### File Locations

| What           | Where               |
| -------------- | ------------------- |
| Business Logic | Features/Handlers   |
| Validation     | Features/Validators |
| HTTP Entry     | Features/Endpoints  |
| Entities       | Domain/Entities     |
| Errors         | Domain/Errors       |
| Database       | Infrastructure      |
| Services       | Infrastructure      |
| Settings       | Infrastructure      |

---

## Architecture Decisions

### Why This Architecture?

**Modular Monolith** is chosen because:

- ✅ Simpler to develop (single codebase)
- ✅ Easier to deploy (one application)
- ✅ Module boundaries for future microservice split
- ✅ No network latency between modules
- ✅ Shared database for transactional consistency

**Vertical Slice** because:

- ✅ All feature code in one place
- ✅ Easy to understand complete flow
- ✅ Easy to delete/modify features
- ✅ Reduces cognitive load

**CQRS** because:

- ✅ Clear separation of reads vs writes
- ✅ Scales reads independently
- ✅ Easier to optimize each side

### When to Split Modules?

Each module should be:

- ✅ Independent business domain
- ✅ Owned by a team
- ✅ Can potentially be a separate service

Current modules (good):

- Identity (authentication)
- Patients (patient management)
- Professionals (provider management)
- Requests (care requests)
- Payments (financial transactions)
- etc.

### Future Microservice Migration

If needed later:

1. Each module can become its own service
2. Keep PublicApi interfaces
3. Add API Gateway for service communication
4. Extract to separate databases if needed

---

## Current Implementation Status

✅ **What's Working**:

- Services are registered correctly
- Features can use Infrastructure services
- Everything auto-discovers and registers
- Result pattern is implemented

⚠️ **Recommended Future Improvements**:

- Extract service interfaces for better testability
- Consider using interfaces instead of concrete classes
- This is NOT urgent - current code works fine!

---

## Summary

**Key Points**:

1. Features depends on Infrastructure ✅ (this is correct!)
2. Services defined and registered in Infrastructure
3. Host orchestrates via DI methods
4. Everything auto-registers
5. Use Result pattern for errors
6. Keep features self-contained
7. Consider interfaces for services (future enhancement)

**Follow these patterns and you'll build scalable, maintainable code!** 🚀
