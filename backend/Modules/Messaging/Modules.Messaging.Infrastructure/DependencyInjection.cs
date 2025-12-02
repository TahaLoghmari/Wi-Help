using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Modules.Messaging.Infrastructure.Database;
using Modules.Messaging.Infrastructure.Services;
using Modules.Messaging.PublicApi;

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

        // Note: IUserIdProvider is already registered by NotificationsInfrastructure
        // Both modules use the same user ID resolution logic (JWT 'sub' claim)
        // Don't register again to avoid duplicate singleton registrations

        // Register connection tracker as singleton
        services.AddSingleton<ConnectionTracker>();

        // Register conversation access service for hub authorization
        services.AddScoped<IConversationAccessService, ConversationAccessService>();

        // Register background job
        services.AddScoped<Jobs.MessageStatusUpdateJob>();

        return services;
    }
}

