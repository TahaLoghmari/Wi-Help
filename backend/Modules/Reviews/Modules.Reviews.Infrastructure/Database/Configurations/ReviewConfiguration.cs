using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Reviews.Domain.Entities;

namespace Modules.Reviews.Infrastructure.Database.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.ToTable("reviews");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.PatientId).IsRequired();
        builder.Property(r => r.ProfessionalId).IsRequired();

        builder.Property(r => r.Comment)
            .HasMaxLength(2000)
            .IsRequired();

        builder.Property(r => r.Rating)
            .IsRequired();

        builder.Property(r => r.CreatedAt).IsRequired();
        builder.Property(r => r.UpdatedAt).IsRequired();

        // Ensure a patient can only have one review per professional
        builder.HasIndex(r => new { r.PatientId, r.ProfessionalId })
            .IsUnique();
    }
}

