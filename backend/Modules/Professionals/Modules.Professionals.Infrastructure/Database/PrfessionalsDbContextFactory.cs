using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Modules.Professionals.Infrastructure.Database;

public class ProfessionalsDbContextFactory : IDesignTimeDbContextFactory<ProfessionalsDbContext>
{


    public ProfessionalsDbContext CreateDbContext(string[] args)
    {
        // Build configuration - look for appsettings.json in the API project
        var basePath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "..", "..", "..", "..", "..");   // now points to the Wi-Help root where .env lives
        var configuration = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddEnvironmentVariables()
            .Build();

        // Get connection string
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        if (string.IsNullOrEmpty(connectionString))
            throw new InvalidOperationException("Database connection string not found in configuration.");

        // Configure DbContextOptions
        var optionsBuilder = new DbContextOptionsBuilder<ProfessionalsDbContext>();
        optionsBuilder.UseNpgsql(
                connectionString,
                npgsqlOptions =>
                {
                    npgsqlOptions.MigrationsHistoryTable(DbConsts.MigrationHistoryTableName, DbConsts.ProfessionalsSchemaName);
                })
            .UseSnakeCaseNamingConvention();

        return new ProfessionalsDbContext(optionsBuilder.Options);
    }
}