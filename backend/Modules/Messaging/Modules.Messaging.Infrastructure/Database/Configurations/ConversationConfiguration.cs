using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Messaging.Domain.Entities;

namespace Modules.Messaging.Infrastructure.Database.Configurations;

public class ConversationConfiguration : IEntityTypeConfiguration<Conversation>
{
    public void Configure(EntityTypeBuilder<Conversation> builder)
    {
        builder.ToTable("conversations");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Participant1Id).IsRequired();
        builder.Property(c => c.Participant2Id).IsRequired();
        builder.Property(c => c.Type).IsRequired();
        builder.Property(c => c.CreatedAt).IsRequired();
        builder.Property(c => c.UpdatedAt).IsRequired();

        builder.Property(c => c.LastMessageAt).IsRequired(false);

        // Index for efficient querying by participants
        builder.HasIndex(c => new { c.Participant1Id, c.Participant2Id });
        builder.HasIndex(c => new { c.Participant2Id, c.Participant1Id });

        // Relationship with messages
        builder.HasMany(c => c.Messages)
            .WithOne(m => m.Conversation)
            .HasForeignKey(m => m.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

