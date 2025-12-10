using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Modules.Reports.Infrastructure.Database;

namespace Modules.Reports.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddReportsInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ReportsDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("Database"),
                npgsqlOptions => npgsqlOptions
                    .MigrationsHistoryTable("__EFMigrationsHistory", "reports")));

        return services;
    }
}
