using Microsoft.Extensions.DependencyInjection;
using Modules.Messaging.PublicApi;

namespace Modules.Messaging.Features;

public static class DependencyInjection
{
    public static IServiceCollection AddMessagingModule(this IServiceCollection services)
    {
        services.AddScoped<IMessagingModuleApi, MessagingModuleApi>();
        
        return services;
    }
}

