using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Modules.Professionals.Infrastructure.Database;
using Modules.Professionals.Infrastructure.Database.Operations;
using Modules.Professionals.Domain.Ports;

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
        services.AddScoped<IProfessionalProfileOperations, ProfessionalProfileOperations>();
        services.AddScoped<IProfessionalCatalogOperations, ProfessionalCatalogOperations>();
        services.AddScoped<IProfessionalScheduleOperations, ProfessionalScheduleOperations>();
        services.AddScoped<IVerificationDocumentOperations, VerificationDocumentOperations>();
        services.AddScoped<IAwardOperations, AwardOperations>();
        services.AddScoped<IWorkExperienceOperations, WorkExperienceOperations>();
        services.AddScoped<IEducationOperations, EducationOperations>();
        return services;
    }
}
