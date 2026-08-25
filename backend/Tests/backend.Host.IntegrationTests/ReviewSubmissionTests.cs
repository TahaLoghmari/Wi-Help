using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Modules.Reviews.Domain.Entities;
using Modules.Reviews.Domain.Enums;
using Modules.Reviews.Infrastructure.Database;

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

    [Fact]
    public async Task AuthenticatedProfessional_GetsOnlySubjectReviewsInRequestedPage()
    {
        var actors = await AppointmentTestData.CreatePatientAndProfessionalAsync(factory);
        var oldestReview = new Review(Guid.NewGuid(), actors.Professional.ProfileId, "Oldest subject review", 3,
            ReviewType.ProfessionalReview);
        var middleReview = new Review(Guid.NewGuid(), actors.Professional.ProfileId, "Middle subject review", 4,
            ReviewType.ProfessionalReview);
        var newestReview = new Review(Guid.NewGuid(), actors.Professional.ProfileId, "Newest subject review", 5,
            ReviewType.ProfessionalReview);
        var otherSubjectReview = new Review(Guid.NewGuid(), Guid.NewGuid(), "Other subject review", 5,
            ReviewType.ProfessionalReview);

        using (var scope = factory.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<ReviewsDbContext>();
            dbContext.Reviews.AddRange(oldestReview, middleReview, newestReview, otherSubjectReview);
            dbContext.Entry(oldestReview).Property(review => review.CreatedAt).CurrentValue = DateTime.UtcNow.AddMinutes(-3);
            dbContext.Entry(middleReview).Property(review => review.CreatedAt).CurrentValue = DateTime.UtcNow.AddMinutes(-2);
            dbContext.Entry(newestReview).Property(review => review.CreatedAt).CurrentValue = DateTime.UtcNow.AddMinutes(-1);
            await dbContext.SaveChangesAsync();
        }

        using var client = factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer", await LoginAsync(client, actors.Professional.Email, actors.Professional.Password));

        var response = await client.GetAsync($"/reviews?subjectId={actors.Professional.ProfileId}&page=2&pageSize=2");

        response.StatusCode.Should().Be(HttpStatusCode.OK, await response.Content.ReadAsStringAsync());
        var page = await response.Content.ReadFromJsonAsync<ReviewsPage>();
        page.Should().NotBeNull();
        page!.TotalCount.Should().Be(3);
        page.Page.Should().Be(2);
        page.PageSize.Should().Be(2);
        page.Items.Should().ContainSingle();
        page.Items[0].Comment.Should().Be("Oldest subject review");
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

    private sealed record ReviewsPage(List<ReviewResponse> Items, int Page, int PageSize, int TotalCount);

    private sealed record ReviewResponse(string Comment);
}
