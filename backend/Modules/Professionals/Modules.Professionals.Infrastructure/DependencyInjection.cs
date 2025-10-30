using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Modules.Professionals.Infrastructure.Database;

namespace Modules.Professionals.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddProfessionalsInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<ProfessionalsDbContext>(x => x
            .UseNpgsql(configuration.GetConnectionString("DefaultConnection"), npgsqlOptions =>
                npgsqlOptions.MigrationsHistoryTable(DbConsts.MigrationHistoryTableName, DbConsts.ProfessionalsSchemaName))
            .UseSnakeCaseNamingConvention()
        );
        return services;
    }
}
