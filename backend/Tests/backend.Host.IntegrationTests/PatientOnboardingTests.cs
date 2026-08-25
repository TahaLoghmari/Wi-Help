using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Infrastructure.Database;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Infrastructure.Database;

namespace backend.Host.IntegrationTests;

[Collection(nameof(HostIntegrationCollection))]
public sealed class PatientOnboardingTests(IntegrationTestWebApplicationFactory factory)
{
    private const string Password = "Test@123456";

    [Fact]
    public async Task AuthenticatedUser_CanCompletePatientOnboarding()
    {
        var data = await CreateOnboardingDataAsync(factory);
        using var client = factory.CreateClient();

        var loginResponse = await client.PostAsJsonAsync("/auth/login", new
        {
            data.Email,
            Password
        });
        loginResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var tokens = await loginResponse.Content.ReadFromJsonAsync<Tokens>();
        tokens.Should().NotBeNull();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokens!.AccessToken);

        var response = await client.PostAsJsonAsync("/patients/complete-onboarding", new
        {
            DateOfBirth = "1990-01-01",
            Gender = "Other",
            PhoneNumber = "+15550000000",
            Address = new
            {
                Street = "Test Street",
                City = "Test City",
                PostalCode = "00000",
                data.CountryId,
                data.StateId
            },
            EmergencyContact = new
            {
                FullName = "Test Contact",
                PhoneNumber = "+15550000001",
                data.RelationshipId
            }
        });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    private static async Task<OnboardingData> CreateOnboardingDataAsync(IntegrationTestWebApplicationFactory factory)
    {
        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var identityDbContext = scope.ServiceProvider.GetRequiredService<IdentityDbContext>();
        var patientsDbContext = scope.ServiceProvider.GetRequiredService<PatientsDbContext>();

        var countryId = Guid.NewGuid();
        var stateId = Guid.NewGuid();
        var relationshipId = Guid.NewGuid();
        identityDbContext.Countries.Add(new Country(countryId, $"test-country-{countryId:N}"));
        identityDbContext.States.Add(new State(stateId, $"test-state-{stateId:N}", countryId));
        patientsDbContext.Relationships.Add(new Relationship(relationshipId, $"test-relationship-{relationshipId:N}"));
        await identityDbContext.SaveChangesAsync();
        await patientsDbContext.SaveChangesAsync();

        var userId = Guid.NewGuid().ToString("N");
        var user = User.CreateFromGoogle(
            googleId: $"test-google-{userId}",
            email: $"patient-onboarding-{userId}@example.test",
            firstName: "Patient",
            lastName: "Test",
            profilePictureUrl: null);
        EnsureSucceeded(await userManager.CreateAsync(user, Password));
        EnsureSucceeded(await userManager.AddToRoleAsync(user, "Patient"));

        return new OnboardingData(countryId, stateId, relationshipId, user.Email!);
    }

    private static void EnsureSucceeded(IdentityResult result)
    {
        if (!result.Succeeded)
        {
            throw new InvalidOperationException(string.Join("; ", result.Errors.Select(error => error.Description)));
        }
    }

    private sealed record Tokens(string AccessToken);

    private sealed record OnboardingData(Guid CountryId, Guid StateId, Guid RelationshipId, string Email);
}
