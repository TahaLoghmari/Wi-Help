using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Testcontainers.PostgreSql;

namespace backend.Host.IntegrationTests;

public sealed class IntegrationTestWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _postgres = new PostgreSqlBuilder()
        .WithImage("postgres:16.8")
        .WithDatabase("wihelp")
        .WithUsername("postgres")
        .WithPassword("postgres")
        .Build();

    private readonly Dictionary<string, string?> _originalEnvironment = [];

    public IntegrationTestWebApplicationFactory()
    {
        SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "Testing");
        SetEnvironmentVariable("DOTNET_ENVIRONMENT", "Testing");
        SetEnvironmentVariable("Jwt__Issuer", "wi-help-tests");
        SetEnvironmentVariable("Jwt__Audience", "wi-help-tests");
        SetEnvironmentVariable("Jwt__Key", "test-signing-key-that-is-long-enough-for-hmac-sha256");
        SetEnvironmentVariable("Jwt__ExpirationInMinutes", "30");
        SetEnvironmentVariable("Jwt__RefreshTokenExpirationDays", "7");
        SetEnvironmentVariable("Google__ClientId", "test-client-id");
        SetEnvironmentVariable("Google__ClientSecret", "test-client-secret");
        SetEnvironmentVariable("ADMIN_EMAIL", "admin@wihelp.com");
        SetEnvironmentVariable("ADMIN_PASSWORD", "Admin@123456");
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
    }

    public async Task InitializeAsync()
    {
        await _postgres.StartAsync();

        SetEnvironmentVariable("ConnectionStrings__DefaultConnection", _postgres.GetConnectionString());
        SetEnvironmentVariable("FRONTEND_URL", "http://localhost:5173");
    }

    public new async Task DisposeAsync()
    {
        foreach ((string name, string? value) in _originalEnvironment)
        {
            Environment.SetEnvironmentVariable(name, value);
        }

        await _postgres.DisposeAsync();
    }

    private void SetEnvironmentVariable(string name, string value)
    {
        _originalEnvironment[name] = Environment.GetEnvironmentVariable(name);
        Environment.SetEnvironmentVariable(name, value);
    }
}
