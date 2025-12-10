using Microsoft.Extensions.DependencyInjection;
using Modules.Reports.PublicApi;

namespace Modules.Reports.Features;

public static class DependencyInjection
{
    public static IServiceCollection AddReportsModule(this IServiceCollection services)
    {
        services.AddScoped<IReportsModuleApi, ReportsModuleApi>();
        return services;
    }
}
