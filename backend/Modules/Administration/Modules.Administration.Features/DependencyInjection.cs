using Microsoft.Extensions.DependencyInjection;

namespace Modules.Administration.Features;

public static class DependencyInjection
{
    public static IServiceCollection AddAdministrationModule(this IServiceCollection services)
    {
        // No public API needed for Administration module as it's only used by admins
        return services;
    }
}
