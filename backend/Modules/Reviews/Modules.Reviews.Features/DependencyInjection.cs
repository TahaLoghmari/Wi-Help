using Microsoft.Extensions.DependencyInjection;
namespace Modules.Reviews.Features;

public static class DependencyInjection
{
    public static IServiceCollection AddReviewsModule(this IServiceCollection services)
    {
        return services;
    }
}
