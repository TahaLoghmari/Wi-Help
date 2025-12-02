using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Infrastructure.Database.Configurations;

public class EducationConfiguration : IEntityTypeConfiguration<Education>
{
    public void Configure(EntityTypeBuilder<Education> builder)
    {
        builder.ToTable("educations");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.ProfessionalId)
            .IsRequired();

        builder.Property(e => e.Institution)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(e => e.Degree)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.FieldOfStudy)
            .HasMaxLength(200)
            .IsRequired(false);

        builder.Property(e => e.Country)
            .HasMaxLength(100)
            .IsRequired(false);

        builder.Property(e => e.StartYear)
            .IsRequired()
            .HasMaxLength(10);

        builder.Property(e => e.EndYear)
            .HasMaxLength(10)
            .IsRequired(false);

        builder.Property(e => e.IsCurrentlyStudying)
            .IsRequired();

        builder.Property(e => e.CreatedAt)
            .IsRequired();

        builder.Property(e => e.UpdatedAt)
            .IsRequired();

        builder.HasOne(e => e.Professional)
            .WithMany(p => p.Educations)
            .HasForeignKey(e => e.ProfessionalId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => e.ProfessionalId);
    }
}
