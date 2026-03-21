using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Infrastructure.Database.Configurations;

public class ProfessionalConfiguration : IEntityTypeConfiguration<Professional>
{
    public void Configure(EntityTypeBuilder<Professional> builder)
    {
        builder.ToTable("professionals");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.UserId)
            .IsRequired();

        builder.Property(p => p.SpecializationId)
            .IsRequired();

        builder.HasOne(p => p.Specialization)
            .WithMany()
            .HasForeignKey(p => p.SpecializationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(p => p.Experience)
            .IsRequired();

        builder.Property(p => p.VisitPrice)
            .IsRequired();

        builder.Property(p => p.Bio)
            .HasMaxLength(2000)
            .IsRequired(false);

        builder.Property(p => p.CreatedAt)
            .IsRequired();

        builder.Property(p => p.UpdatedAt)
            .IsRequired();

        builder.HasMany(p => p.Services)
            .WithMany()
            .UsingEntity<Dictionary<string, object>>(
                "professional_services",
                r => r.HasOne<Service>().WithMany().HasForeignKey("service_id").OnDelete(DeleteBehavior.Cascade),
                l => l.HasOne<Professional>().WithMany().HasForeignKey("professional_id").OnDelete(DeleteBehavior.Cascade),
                je =>
                {
                    je.ToTable("professional_services");
                    je.HasKey("professional_id", "service_id");
                });
    }
}
