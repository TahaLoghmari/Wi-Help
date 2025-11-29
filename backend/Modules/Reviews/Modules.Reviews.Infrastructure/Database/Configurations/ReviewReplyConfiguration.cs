using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Reviews.Domain.Entities;

namespace Modules.Reviews.Infrastructure.Database.Configurations;

public class ReviewReplyConfiguration : IEntityTypeConfiguration<ReviewReply>
{
    public void Configure(EntityTypeBuilder<ReviewReply> builder)
    {
        builder.ToTable("review_replies");

        builder.HasKey(rr => rr.Id);

        builder.Property(rr => rr.ReviewId).IsRequired();
        builder.Property(rr => rr.UserId).IsRequired();

        builder.Property(rr => rr.Comment)
            .HasMaxLength(2000)
            .IsRequired();

        builder.Property(rr => rr.CreatedAt).IsRequired();
        builder.Property(rr => rr.UpdatedAt).IsRequired();
    }
}

