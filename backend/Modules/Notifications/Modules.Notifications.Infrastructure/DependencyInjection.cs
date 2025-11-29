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
        });

        // Register custom user ID provider to map JWT 'sub' claim to SignalR user identifier
        services.AddSingleton<IUserIdProvider, UserIdProvider>();

        services.AddScoped<NotificationsService>();

        return services;
    }
}