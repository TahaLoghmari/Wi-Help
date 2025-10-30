using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Modules.Patients.Infrastructure.Database;

namespace Modules.Patients.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddPatientsInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<PatientsDbContext>(x => x
            .UseNpgsql(configuration.GetConnectionString("DefaultConnection"), npgsqlOptions =>
                npgsqlOptions.MigrationsHistoryTable(DbConsts.MigrationHistoryTableName, DbConsts.PatientsSchemaName))
            .UseSnakeCaseNamingConvention()
        );
        return services;
    }
}


