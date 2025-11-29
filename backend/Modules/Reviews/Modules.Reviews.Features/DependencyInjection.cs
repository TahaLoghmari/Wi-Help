using Microsoft.Extensions.DependencyInjection;
using Modules.Reviews.PublicApi;

namespace Modules.Reviews.Features;

public static class DependencyInjection
{
    public static IServiceCollection AddReviewsModule(this IServiceCollection services)
    {
        services.AddScoped<IReviewsModuleApi, ReviewsModuleApi>();
        return services;
    }
}

