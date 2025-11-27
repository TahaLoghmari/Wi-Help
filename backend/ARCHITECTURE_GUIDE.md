dependencies should flow from specific/feature modules toward core/shared modules, not the other way around.

Excellent question! Let me explain the **principles** that determine dependency direction in modular architecture.

## Core Principles for Dependency Direction

### 1. **Stable Dependencies Principle (SDP)**

> Dependencies should flow toward **stability**. Stable modules change less frequently.

**Identity is more stable than Professional/Patient because:**

- Identity concerns (authentication, users, roles) change rarely
- Professional/Patient features (profiles, specializations, appointments) change often based on business needs
- If Identity depended on Professional, every Professional change could break Identity

**Rule:** Less stable → More stable

### 2. **Acyclic Dependencies Principle (ADP)**

> No circular dependencies. Dependencies must form a Directed Acyclic Graph (DAG).

**If Identity → Professional AND Professional → Identity:**

- You create a cycle
- Both modules become tightly coupled
- You can't compile/deploy/test them independently
- Changes cascade unpredictably

**Rule:** Dependencies must flow in ONE direction only

### 3. **Common Reuse Principle (CRP)**

> Modules should only depend on things they actually use.

**Why Identity shouldn't depend on Professional:**

- When you register a Patient, does Identity need to know about Professional module? No!
- Identity would carry unnecessary dependencies
- Identity becomes bloated with concerns it doesn't need

**Rule:** Only depend on what you actually use

### 4. **Business Domain Hierarchy**

> Dependencies flow from **specific** to **generic**, from **business logic** to **infrastructure**.

```
Specific Business Logic (changes often)
         ↓
    Shared Business Concepts (changes moderately)
         ↓
    Technical Infrastructure (changes rarely)
```

In your case:

```
Professional/Patient (specific business features)
         ↓
    Identity (shared authentication concern)
         ↓
    Common (shared utilities)
```

## How to Determine Direction: The Questions

When deciding between `Module A → Module B` or `Module B → Module A`, ask:

### Question 1: **Which is more fundamental?**

- Can Professional exist without Identity? **No** (needs authentication)
- Can Identity exist without Professional? **Yes** (it's just user management)
- **Therefore:** Professional → Identity

### Question 2: **Which changes more often?**

- Do Professional features change often? **Yes** (business evolves)
- Does Identity change often? **No** (authentication is stable)
- **Therefore:** Professional → Identity (volatile → stable)

### Question 3: **Which is more reusable?**

- Can Identity be used by other modules? **Yes** (Patient, Admin, etc.)
- Can Professional be used by other modules? **No** (it's specific)
- **Therefore:** Professional → Identity (specific → reusable)

### Question 4: **Who knows more about whom?**

- Does Professional need to know "users exist"? **Yes**
- Does Identity need to know "professionals exist"? **No**
- **Therefore:** Professional → Identity

### Question 5: **Substitutability Test**

- Could you swap Professional with Patient? **Yes** (both are user types)
- Could you swap Identity with something else? **No** (it's fundamental)
- **Therefore:** Professional → Identity (variable → fixed)

**Rule:** Dependencies point **downward** ⬇️, never upward ⬆️

## Red Flags That Direction is Wrong

If you find yourself doing these, you've got the direction backwards:

1. **Using conditionals based on caller:**

```csharp
// ❌ BAD: Identity shouldn't know about Professional
if (userType == "Professional") {
    _professionalService.CreateProfile();
}
```

2. **Frequent changes in the dependency:**

```csharp
// ❌ BAD: Every time Professional changes, Identity breaks
void CreateUser(ProfessionalSpecialization specialization) { }
```

3. **Tight coupling to specifics:**

```csharp
// ❌ BAD: Identity coupled to domain-specific logic
class User {
    public string MedicalLicenseNumber { get; set; } // Professional-specific!
}
```

## Your Scenarios Explained

### Registration Flow:

**Why Professional → Identity (not Identity → Professional)?**

```
❌ WRONG: Identity orchestrates
┌──────────┐
│ Identity │──→ "I need to create a professional"
└──────────┘──→ "Let me call Professional module"
               └→ Now Identity knows about Professional!
               └→ What about Patient? Admin? Doctor? Nurse?
               └→ Identity becomes coupled to ALL role types!

✅ CORRECT: Professional orchestrates
┌──────────────┐
│ Professional │──→ "I need a user for this professional"
└──────────────┘──→ "Let me call Identity to create user"
                  └→ Identity stays generic!
                  └→ Professional owns its own registration logic
                  └→ Patient can do the same independently
```

**Mental Model:**

- Identity is like a **library** (reusable, stable)
- Professional is like an **application** (specific, changes often)
- Applications call libraries, not the other way around!

Golden Rule: The module that owns the relationship data owns the queries about that relationship.
✅ Appointments owns Professional-Patient relationships
→ Appointments exposes GetProfessionalPatients

❌ Professionals doesn't own appointment history
→ Would need to call Appointments.PublicApi anyway

If you're in some module and you are using another module's public API, you can the use the return type contracts defined in its PublicApi
