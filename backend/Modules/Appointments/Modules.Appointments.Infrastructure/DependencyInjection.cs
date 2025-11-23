using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Modules.Appointments.Infrastructure.Database;

namespace Modules.Appointments.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddAppointmentsInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<AppointmentsDbContext>(x => x
            .UseNpgsql(configuration.GetConnectionString("DefaultConnection"), npgsqlOptions =>
                npgsqlOptions.MigrationsHistoryTable(DbConsts.MigrationHistoryTableName, DbConsts.AppointmentsSchemaName))
            .UseSnakeCaseNamingConvention()
        );
        return services;
    }
}
