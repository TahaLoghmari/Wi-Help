using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Modules.Professionals.Infrastructure.Database;
using Modules.Professionals.Infrastructure.Database.Repositories;
using Modules.Professionals.Domain.Repositories;

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
        services.AddScoped<IProfessionalRepository, ProfessionalRepository>();
        services.AddScoped<IProfessionalCatalogRepository, ProfessionalCatalogRepository>();
        services.AddScoped<IProfessionalScheduleRepository, ProfessionalScheduleRepository>();
        services.AddScoped<IVerificationDocumentRepository, VerificationDocumentRepository>();
        services.AddScoped<IProfessionalQualificationsRepository, ProfessionalQualificationsRepository>();
        return services;
    }
}
