using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;

namespace backend.Host.IntegrationTests;

[Collection(nameof(HostIntegrationCollection))]
public sealed class AuthenticationEndpointsTests(IntegrationTestWebApplicationFactory factory)
{
    [Fact]
    public async Task LoginAndRefresh_WithSeededAdmin_ReturnsRotatedTokens()
    {
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            HandleCookies = true
        });

        var loginResponse = await client.PostAsJsonAsync("/auth/login", new
        {
            Email = "admin@wihelp.com",
            Password = "Admin@123456"
        });

        loginResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var loginTokens = await loginResponse.Content.ReadFromJsonAsync<Tokens>();
        loginTokens.Should().NotBeNull();
        loginTokens!.AccessToken.Should().NotBeNullOrWhiteSpace();
        loginTokens.RefreshToken.Should().NotBeNullOrWhiteSpace();

        var refreshResponse = await client.PostAsync("/auth/refresh", null);

        refreshResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var refreshTokens = await refreshResponse.Content.ReadFromJsonAsync<Tokens>();
        refreshTokens.Should().NotBeNull();
        refreshTokens!.AccessToken.Should().NotBeNullOrWhiteSpace();
        refreshTokens.RefreshToken.Should().NotBe(loginTokens.RefreshToken);
    }

    [Fact]
    public async Task ChangePassword_WithInvalidNewPassword_ReturnsIdentityFailureDescription()
    {
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            HandleCookies = true
        });

        var loginResponse = await client.PostAsJsonAsync("/auth/login", new
        {
            Email = "admin@wihelp.com",
            Password = "Admin@123456"
        });
        loginResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var response = await client.PostAsJsonAsync("/auth/change-password", new
        {
            CurrentPassword = "Admin@123456",
            NewPassword = "Abcdef"
        });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var problem = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        problem.Should().NotBeNull();
        problem!.Title.Should().Be("Identity.PasswordChangeFailed");
        problem.Detail.Should().Contain("Passwords must have at least one non alphanumeric character.");
    }

    private sealed record Tokens(string AccessToken, string RefreshToken);
}
