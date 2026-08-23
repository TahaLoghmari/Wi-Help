using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Modules.Reviews.Domain.Abstractions;
using Modules.Reviews.Infrastructure.Database;

namespace Modules.Reviews.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddReviewsInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<ReviewsDbContext>(x => x
            .UseNpgsql(configuration.GetConnectionString("DefaultConnection"), npgsqlOptions =>
                npgsqlOptions.MigrationsHistoryTable(DbConsts.MigrationHistoryTableName, DbConsts.ReviewsSchemaName))
            .UseSnakeCaseNamingConvention()
        );
        services.AddScoped<ReviewOperationPorts>();
        services.AddScoped<ISubmitReviewPort>(serviceProvider => serviceProvider.GetRequiredService<ReviewOperationPorts>());
        services.AddScoped<IEditReviewPort>(serviceProvider => serviceProvider.GetRequiredService<ReviewOperationPorts>());
        services.AddScoped<IDeleteReviewPort>(serviceProvider => serviceProvider.GetRequiredService<ReviewOperationPorts>());
        services.AddScoped<ILikeReviewPort>(serviceProvider => serviceProvider.GetRequiredService<ReviewOperationPorts>());
        services.AddScoped<IUnlikeReviewPort>(serviceProvider => serviceProvider.GetRequiredService<ReviewOperationPorts>());
        services.AddScoped<IReplyToReviewPort>(serviceProvider => serviceProvider.GetRequiredService<ReviewOperationPorts>());
        services.AddScoped<IEditReplyPort>(serviceProvider => serviceProvider.GetRequiredService<ReviewOperationPorts>());
        services.AddScoped<IDeleteReplyPort>(serviceProvider => serviceProvider.GetRequiredService<ReviewOperationPorts>());
        services.AddScoped<IGetReviewsPort>(serviceProvider => serviceProvider.GetRequiredService<ReviewOperationPorts>());
        services.AddScoped<IGetReviewsForAdminPort>(serviceProvider => serviceProvider.GetRequiredService<ReviewOperationPorts>());
        services.AddScoped<IGetReviewStatsPort>(serviceProvider => serviceProvider.GetRequiredService<ReviewOperationPorts>());
        return services;
    }
}
