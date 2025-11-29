using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Modules.Messaging.Infrastructure.Database;
using Modules.Messaging.Infrastructure.Services;

namespace Modules.Messaging.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddMessagingInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<MessagingDbContext>(x => x
            .UseNpgsql(configuration.GetConnectionString("DefaultConnection"), npgsqlOptions =>
                npgsqlOptions.MigrationsHistoryTable(DbConsts.MigrationHistoryTableName, DbConsts.MessagingSchemaName))
            .UseSnakeCaseNamingConvention()
        );

        // Register SignalR UserIdProvider if not already registered
        services.AddSingleton<IUserIdProvider, UserIdProvider>();

        // Register connection tracker as singleton
        services.AddSingleton<ConnectionTracker>();

        // Register background job
        services.AddScoped<Jobs.MessageStatusUpdateJob>();

        return services;
    }
}

