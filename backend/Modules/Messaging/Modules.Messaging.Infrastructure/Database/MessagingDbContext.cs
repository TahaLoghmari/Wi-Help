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

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.HasDefaultSchema(DbConsts.MessagingSchemaName);
        builder.ApplyConfigurationsFromAssembly(typeof(MessagingDbContext).Assembly);
    }
}

