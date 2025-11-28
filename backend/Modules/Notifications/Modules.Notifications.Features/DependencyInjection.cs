using Microsoft.Extensions.DependencyInjection;
using Modules.Notifications.Infrastructure;
using Modules.Notifications.PublicApi;

namespace Modules.Notifications.Features;

public static class DependencyInjection
{
    public static IServiceCollection AddNotificationsModule(this IServiceCollection services)
    {
        services.AddScoped<INotificationsModuleApi, NotificationsModuleApi>();
        return services;
    }
}