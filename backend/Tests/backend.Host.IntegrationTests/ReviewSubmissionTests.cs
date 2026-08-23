using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;

namespace backend.Host.IntegrationTests;

[Collection(nameof(HostIntegrationCollection))]
public sealed class ReviewSubmissionTests(IntegrationTestWebApplicationFactory factory)
{
    [Fact]
    public async Task AuthenticatedPatient_CanSubmitReviewForExistingProfessional()
    {
        var actors = await AppointmentTestData.CreatePatientAndProfessionalAsync(factory);
        using var client = factory.CreateClient();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer", await LoginAsync(client, actors.Patient.Email, actors.Patient.Password));

        var response = await client.PostAsJsonAsync("/reviews", new
        {
            SubjectId = actors.Professional.ProfileId,
            Comment = "Excellent care and clear communication.",
            Rating = 5
        });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    private static async Task<string> LoginAsync(HttpClient client, string email, string password)
    {
        var response = await client.PostAsJsonAsync("/auth/login", new { Email = email, Password = password });

        response.StatusCode.Should().Be(HttpStatusCode.OK, await response.Content.ReadAsStringAsync());
        var tokens = await response.Content.ReadFromJsonAsync<Tokens>();
        tokens.Should().NotBeNull();
        tokens!.AccessToken.Should().NotBeNullOrWhiteSpace();

        return tokens.AccessToken;
    }

    private sealed record Tokens(string AccessToken);
}
