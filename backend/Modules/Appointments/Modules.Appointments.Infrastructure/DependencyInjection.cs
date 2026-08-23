using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Modules.Appointments.Domain.Ports;
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
        services.AddScoped<IBookAppointmentStore, BookAppointmentStore>();
        services.AddScoped<IRespondToAppointmentStore, RespondToAppointmentStore>();
        services.AddScoped<ICancelAppointmentStore, CancelAppointmentStore>();
        services.AddScoped<ICancelAppointmentByProfessionalStore, CancelAppointmentByProfessionalStore>();
        services.AddScoped<ICompleteAppointmentStore, CompleteAppointmentStore>();
        services.AddScoped<IUpdateAppointmentStatusByAdminStore, UpdateAppointmentStatusByAdminStore>();
        services.AddScoped<IDeletePrescriptionStore, DeletePrescriptionStore>();
        services.AddScoped<IGetAllAppointmentsForAdminStore, GetAllAppointmentsForAdminStore>();
        services.AddScoped<IGetPatientPrescriptionsStore, GetPatientPrescriptionsStore>();
        services.AddScoped<IGetPatientProfessionalsStore, GetPatientProfessionalsStore>();
        services.AddScoped<IGetAllPrescriptionsForAdminStore, GetAllPrescriptionsForAdminStore>();
        services.AddScoped<IGetPatientAppointmentsStore, GetPatientAppointmentsStore>();
        services.AddScoped<IGetProfessionalAppointmentsStore, GetProfessionalAppointmentsStore>();
        services.AddScoped<IGetAppointmentByIdStore, GetAppointmentByIdStore>();
        services.AddScoped<IGetProfessionalPatientsStore, GetProfessionalPatientsStore>();
        services.AddScoped<IGetBookedSessionsStore, GetBookedSessionsStore>();
        return services;
    }
}
