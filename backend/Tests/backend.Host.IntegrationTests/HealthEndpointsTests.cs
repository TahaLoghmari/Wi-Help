using System.Net;
using FluentAssertions;

namespace backend.Host.IntegrationTests;

[Collection(nameof(HostIntegrationCollection))]
public sealed class HealthEndpointsTests(IntegrationTestWebApplicationFactory factory)
{
    [Fact]
    public async Task GetReadyHealth_WhenPostgreSqlMigrationsComplete_ReturnsOk()
    {
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/health/ready");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
