using Microsoft.Extensions.DependencyInjection;
using Modules.Appointments.PublicApi;

namespace Modules.Appointments.Features;

public static class DependencyInjection
{
    public static IServiceCollection AddAppointmentsModule(this IServiceCollection services)
    {
        services.AddScoped<IAppointmentsModuleApi, AppointmentsModuleApi>();
        return services;
    }
}