using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Modules.Messaging.Domain.Repositories;
using Modules.Messaging.Domain.Services;
using Modules.Messaging.Infrastructure.Database;
using Modules.Messaging.Infrastructure.Jobs;
using Modules.Messaging.Infrastructure.Services;
using Modules.Messaging.Infrastructure.Database.Repositories;

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

        services.AddScoped<IConversationAccessService, ConversationAccessService>();
        services.AddScoped<IConversationRepository, ConversationRepository>();
        services.AddScoped<IMessageDeliveryRepository, MessageDeliveryRepository>();
        services.AddSingleton<ConnectionTracker>();
        services.AddScoped<IMessagingRealtimeEvents, SignalRMessagingRealtimeEvents>();
        services.AddScoped<MessageStatusUpdateJob>();

        return services;
    }
}
