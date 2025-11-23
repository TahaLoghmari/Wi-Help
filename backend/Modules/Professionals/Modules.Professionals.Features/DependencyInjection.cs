using Microsoft.Extensions.DependencyInjection;
using Modules.Professionals.PublicApi;

namespace Modules.Professionals.Features;

public static class DependencyInjection
{
    public static IServiceCollection AddProfessionalsModule(this IServiceCollection services)
    {
        services.AddScoped<IProfessionalModuleApi, ProfessionalModuleApi>();
        
        return services;
    }
}