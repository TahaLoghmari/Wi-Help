
using Microsoft.EntityFrameworkCore;
using Modules.Notifications.Domain.Entities;

namespace Modules.Notifications.Infrastructure.Database;
public sealed class NotificationsDbContext(DbContextOptions<NotificationsDbContext> options) : DbContext(options)
{
    public DbSet<Notification> Notifications { get; set; }
    
    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Properties<Enum>()
            .HaveConversion<string>();
    } 
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder); 
        builder.HasDefaultSchema(DbConsts.NotificationsSchemaName);
        builder.ApplyConfigurationsFromAssembly(typeof(NotificationsDbContext).Assembly);
    }
}