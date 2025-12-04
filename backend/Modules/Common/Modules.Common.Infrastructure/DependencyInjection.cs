using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Modules.Common.Infrastructure.Services;
using Modules.Common.Infrastructure.Settings;

namespace Modules.Common.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddCommonInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<SupabaseSettings>(configuration.GetSection("Supabase"));
        services.AddSingleton<SupabaseService>();
        
        services.Configure<EmailSettings>(configuration.GetSection("Email"));
        services.AddScoped<EmailService>();
        
        return services;
    }
}
