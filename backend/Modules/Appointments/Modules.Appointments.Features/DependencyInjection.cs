using Microsoft.Extensions.DependencyInjection;

namespace Modules.Appointments.Features;

public static class DependencyInjection
{
    public static IServiceCollection AddAppointmentsModule(this IServiceCollection services)
    {
        return services;
    }
}
