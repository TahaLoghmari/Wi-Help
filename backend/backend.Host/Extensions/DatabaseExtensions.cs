using Microsoft.EntityFrameworkCore;
using Modules.Appointments.Infrastructure.Database;
using Modules.Identity.Infrastructure.Database;
using Modules.Messaging.Infrastructure.Database;
using Modules.Notifications.Infrastructure.Database;
using Modules.Patients.Infrastructure.Database;
using Modules.Professionals.Infrastructure.Database;
using Modules.Reviews.Infrastructure.Database;

namespace backend.Host.Extensions;

internal static class DatabaseExtensions
{
    public static async Task ApplyMigrationsAsync(this WebApplication app)
    {
        using IServiceScope scope = app.Services.CreateScope();
        IServiceProvider services = scope.ServiceProvider;
        ILogger<WebApplication> logger = services.GetRequiredService<ILogger<WebApplication>>();

        DbContext[] dbContexts =
        [
            services.GetRequiredService<IdentityDbContext>(),
            services.GetRequiredService<AppointmentsDbContext>(),
            services.GetRequiredService<PatientsDbContext>(),
            services.GetRequiredService<ProfessionalsDbContext>(),
            services.GetRequiredService<NotificationsDbContext>(),
            services.GetRequiredService<MessagingDbContext>(),
            services.GetRequiredService<ReviewsDbContext>()
        ];

        foreach (DbContext dbContext in dbContexts)
        {
            string dbContextName = dbContext.GetType().Name;

            try
            {
                await dbContext.Database.MigrateAsync();
                logger.LogInformation("{DbContextName} migrations applied successfully", dbContextName);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while applying {DbContextName} migrations", dbContextName);
                throw new InvalidOperationException($"Failed to apply migrations for {dbContextName}", ex);
            }
        }
    }
}
