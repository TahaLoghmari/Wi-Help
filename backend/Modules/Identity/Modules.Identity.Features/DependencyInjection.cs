using Microsoft.Extensions.DependencyInjection;
using Modules.Identity.PublicApi;

namespace Modules.Identity.Features;

public static class DependencyInjection
{
    public static IServiceCollection AddIdentityModule(this IServiceCollection services)
    {
        services.AddScoped<IIdentityModuleApi, IdentityModuleApi>();
        
        return services;
    }
}