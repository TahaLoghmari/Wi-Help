using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Modules.Patients.Domain.Ports;
using Modules.Patients.Infrastructure.Adapters;
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
        services.AddScoped<IGetAllergiesPort, GetAllergiesEfAdapter>();
        services.AddScoped<IGetConditionsPort, GetConditionsEfAdapter>();
        services.AddScoped<IGetMedicationsPort, GetMedicationsEfAdapter>();
        services.AddScoped<IGetRelationshipsPort, GetRelationshipsEfAdapter>();
        services.AddScoped<IRegisterPatientPort, RegisterPatientEfAdapter>();
        services.AddScoped<ICompletePatientOnboardingPort, CompletePatientOnboardingEfAdapter>();
        services.AddScoped<IGetAllPatientsPort, GetAllPatientsEfAdapter>();
        services.AddScoped<IGetCurrentPatientPort, GetCurrentPatientEfAdapter>();
        services.AddScoped<IGetPatientPort, GetPatientEfAdapter>();
        services.AddScoped<IUpdatePatientPort, UpdatePatientEfAdapter>();
        services.AddScoped<IPatientModuleApiPort, PatientModuleApiEfAdapter>();
        return services;
    }
}

