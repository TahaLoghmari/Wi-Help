using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Reviews.Domain.Entities;

namespace Modules.Reviews.Infrastructure.Database.Configurations;

public class ReviewLikeConfiguration : IEntityTypeConfiguration<ReviewLike>
{
    public void Configure(EntityTypeBuilder<ReviewLike> builder)
    {
        builder.ToTable("review_likes");

        builder.HasKey(rl => rl.Id);

        builder.Property(rl => rl.ReviewId).IsRequired();
        builder.Property(rl => rl.UserId).IsRequired();
        builder.Property(rl => rl.CreatedAt).IsRequired();

        // Ensure a user can only like a review once
        builder.HasIndex(rl => new { rl.ReviewId, rl.UserId })
            .IsUnique();
    }
}

