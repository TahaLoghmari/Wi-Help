using Microsoft.EntityFrameworkCore;

namespace backend.Host.Extensions;

internal static class DatabaseExtensions
{
    public static async Task ApplyMigrationsAsync(this WebApplication app)
    {
        using IServiceScope scope = app.Services.CreateScope();
        IServiceProvider services = scope.ServiceProvider;
        ILogger<WebApplication> logger = services.GetRequiredService<ILogger<WebApplication>>();

        IEnumerable<DbContext> dbContexts = services.GetServices<DbContext>();

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

