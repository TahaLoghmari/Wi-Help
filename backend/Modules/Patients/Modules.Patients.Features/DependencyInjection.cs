using Microsoft.Extensions.DependencyInjection;
using Modules.Patients.PublicApi;

namespace Modules.Patients.Features;

public static class DependencyInjection
{
    public static IServiceCollection AddPatientsModule(this IServiceCollection services)
    {
        services.AddScoped<IPatientsModuleApi, PatientModuleApi>();
        
        return services;
    }
}