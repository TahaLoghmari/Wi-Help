using Microsoft.Extensions.DependencyInjection;
using Modules.Notifications.Infrastructure;

namespace Modules.Notifications.Features;

public static class DependencyInjection
{
    public static IServiceCollection AddNotificationsModule(this IServiceCollection services)
    {
        // Register handlers, etc.
        return services;
    }
}