using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Modules.Patients.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddPatientsModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<PatientDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
        return services;
    }
}