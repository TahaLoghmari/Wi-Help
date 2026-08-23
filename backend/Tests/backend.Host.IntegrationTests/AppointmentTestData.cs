using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Modules.Common.Features.ValueObjects;
using Modules.Identity.Domain.Entities;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Domain.ValueObjects;
using Modules.Patients.Infrastructure.Database;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Infrastructure.Database;

namespace backend.Host.IntegrationTests;

internal static class AppointmentTestData
{
    private const string Password = "Test@123456";

    public static async Task<AppointmentActors> CreatePatientAndProfessionalAsync(IntegrationTestWebApplicationFactory factory)
    {
        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var patientsDbContext = scope.ServiceProvider.GetRequiredService<PatientsDbContext>();
        var professionalsDbContext = scope.ServiceProvider.GetRequiredService<ProfessionalsDbContext>();

        var patientUser = await CreateUserAsync(userManager, "Patient");
        var patient = new Patient(patientUser.Id, new EmergencyContact("Test Contact", "+15550000001"));
        patientsDbContext.Patients.Add(patient);
        await patientsDbContext.SaveChangesAsync();
        await AddClaimAsync(userManager, patientUser, "PatientId", patient.Id);

        var professionalUser = await CreateUserAsync(userManager, "Professional");
        var specialization = new Specialization(Guid.NewGuid(), $"test-specialization-{Guid.NewGuid():N}");
        var professional = new Professional(professionalUser.Id, specialization.Id, experience: 5);
        professionalsDbContext.Specializations.Add(specialization);
        professionalsDbContext.Professionals.Add(professional);
        await professionalsDbContext.SaveChangesAsync();
        await AddClaimAsync(userManager, professionalUser, "ProfessionalId", professional.Id);

        return new AppointmentActors(
            new TestActor(patientUser.Email!, Password, patient.Id),
            new TestActor(professionalUser.Email!, Password, professional.Id));
    }

    private static async Task<User> CreateUserAsync(UserManager<User> userManager, string role)
    {
        var id = Guid.NewGuid().ToString("N");
        var user = User.Create(
            firstName: role,
            lastName: "Test",
            dateOfBirth: "1990-01-01",
            gender: "Other",
            phoneNumber: "+15550000000",
            email: $"{role.ToLowerInvariant()}-{id}@example.test",
            address: new Address(
                "Test Street",
                "Test City",
                "00000",
                new Guid("00000002-0000-0000-0000-000000000125"),
                new Guid("00000003-0000-0000-0000-000000000084")));

        var createResult = await userManager.CreateAsync(user, Password);
        EnsureSucceeded(createResult);
        EnsureSucceeded(await userManager.AddToRoleAsync(user, role));
        EnsureSucceeded(await userManager.ConfirmEmailAsync(user, await userManager.GenerateEmailConfirmationTokenAsync(user)));

        return user;
    }

    private static async Task AddClaimAsync(UserManager<User> userManager, User user, string type, Guid value) =>
        EnsureSucceeded(await userManager.AddClaimAsync(user, new Claim(type, value.ToString())));

    private static void EnsureSucceeded(IdentityResult result)
    {
        if (!result.Succeeded)
        {
            throw new InvalidOperationException(string.Join("; ", result.Errors.Select(error => error.Description)));
        }
    }
}

internal sealed record AppointmentActors(TestActor Patient, TestActor Professional);

internal sealed record TestActor(string Email, string Password, Guid ProfileId);
