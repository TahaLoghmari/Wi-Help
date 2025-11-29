using Microsoft.EntityFrameworkCore;
using Modules.Messaging.Domain.Entities;

namespace Modules.Messaging.Infrastructure.Database;

public sealed class MessagingDbContext(DbContextOptions<MessagingDbContext> options) : DbContext(options)
{
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<Message> Messages { get; set; }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Properties<Enum>()
            .HaveConversion<string>();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(DbConsts.MessagingSchemaName);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(MessagingDbContext).Assembly);
        
        // Global query filter for soft deletes
        modelBuilder.Entity<Message>().HasQueryFilter(m => m.DeletedAt == null);
        
        base.OnModelCreating(modelBuilder);
    }
}
