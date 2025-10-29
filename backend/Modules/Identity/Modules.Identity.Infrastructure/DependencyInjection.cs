using backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Infrastructure.Database;
using Modules.Identity.Infrastructure.Services;
using Modules.Identity.Infrastructure.Settings;

namespace Modules.Identity.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddIdentityInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<IdentityDbContext>(x => x
            .EnableSensitiveDataLogging()
            .UseNpgsql(configuration.GetConnectionString("DefaultConnection"), npgsqlOptions =>
                npgsqlOptions.MigrationsHistoryTable(DbConsts.MigrationHistoryTableName, DbConsts.IdentitySchemaName))
            .UseSnakeCaseNamingConvention());

        services.AddIdentity<User, IdentityRole<Guid>>()
            .AddEntityFrameworkStores<IdentityDbContext>()
            .AddDefaultTokenProviders();

        // Required for EmailService to access HttpContext
        services.AddHttpContextAccessor();

        services.AddScoped<TokenManagementService>();
        services.AddScoped<TokenProvider>();
        services.AddScoped<EmailService>();

        // Configure settings
        services.Configure<JwtSettings>(configuration.GetSection("Jwt"));
        services.Configure<GoogleSettings>(configuration.GetSection("Google"));
        services.Configure<EmailSettings>(configuration.GetSection("Email"));

        return services;
    }
}

