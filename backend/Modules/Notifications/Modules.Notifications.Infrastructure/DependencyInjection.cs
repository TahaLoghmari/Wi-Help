using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Modules.Notifications.Infrastructure.Database;
using Modules.Notifications.Infrastructure.Services;

namespace Modules.Notifications.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddNotificationsInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<NotificationsDbContext>(x => x
            .UseNpgsql(configuration.GetConnectionString("DefaultConnection"), npgsqlOptions =>
                npgsqlOptions.MigrationsHistoryTable(DbConsts.MigrationHistoryTableName, DbConsts.NotificationsSchemaName))
            .UseSnakeCaseNamingConvention()
        );

        services.AddSignalR(options =>
        {
            // Enable detailed error messages in development
            options.EnableDetailedErrors = configuration.GetValue<bool>("EnableSignalRDetailedErrors", false);
            
            // Configure timeouts to prevent premature disconnections
            // KeepAliveInterval: How often server sends ping to client (default: 15s)
            options.KeepAliveInterval = TimeSpan.FromSeconds(15);
            // ClientTimeoutInterval: How long to wait for client response before disconnecting (default: 30s)
            // Should be at least 2x KeepAliveInterval
            options.ClientTimeoutInterval = TimeSpan.FromSeconds(60);
            // HandshakeTimeout: Time allowed for initial handshake (default: 15s)
            options.HandshakeTimeout = TimeSpan.FromSeconds(15);
        });

        // Register custom user ID provider to map JWT 'sub' claim to SignalR user identifier
        // Note: This is shared across all hubs - only register once
        services.AddSingleton<IUserIdProvider, UserIdProvider>();

        services.AddScoped<NotificationsService>();

        return services;
    }
}