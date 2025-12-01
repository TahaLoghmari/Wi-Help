using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Messaging.Domain.Entities;

namespace Modules.Messaging.Infrastructure.Database.Configurations;

public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        builder.ToTable("messages");

        builder.HasKey(m => m.Id);

        builder.Property(m => m.ConversationId).IsRequired();
        builder.Property(m => m.SenderId).IsRequired();
        builder.Property(m => m.Content)
            .IsRequired()
            .HasMaxLength(5000);
        builder.Property(m => m.Status).IsRequired();
        builder.Property(m => m.CreatedAt).IsRequired();

        builder.Property(m => m.DeliveredAt).IsRequired(false);
        builder.Property(m => m.ReadAt).IsRequired(false);
        builder.Property(m => m.DeletedAt).IsRequired(false);

        // Indexes for efficient querying
        builder.HasOne(m => m.Conversation)
            .WithMany(c => c.Messages)
            .HasForeignKey(m => m.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes for performance
        builder.HasIndex(m => m.ConversationId);
        builder.HasIndex(m => m.SenderId);
        builder.HasIndex(m => new { m.ConversationId, m.CreatedAt });
        builder.HasIndex(m => new { m.ConversationId, m.Status });
        
        // Index for soft delete filter (used by global query filter)
        builder.HasIndex(m => m.DeletedAt)
            .HasFilter("deleted_at IS NULL");
    }
}

