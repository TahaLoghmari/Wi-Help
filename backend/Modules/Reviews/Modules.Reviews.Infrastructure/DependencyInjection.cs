using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Modules.Reviews.Domain.Repositories;
using Modules.Reviews.Infrastructure.Database;
using Modules.Reviews.Infrastructure.Database.Repositories;

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
        services.AddScoped<IReviewRepository, ReviewRepository>();
        return services;
    }
}
