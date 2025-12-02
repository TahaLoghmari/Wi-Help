using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Infrastructure.Database.Configurations;

public class WorkExperienceConfiguration : IEntityTypeConfiguration<WorkExperience>
{
    public void Configure(EntityTypeBuilder<WorkExperience> builder)
    {
        builder.ToTable("work_experiences");

        builder.HasKey(w => w.Id);

        builder.Property(w => w.ProfessionalId)
            .IsRequired();

        builder.Property(w => w.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(w => w.Organization)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(w => w.Location)
            .HasMaxLength(200)
            .IsRequired(false);

        builder.Property(w => w.Description)
            .HasMaxLength(1000)
            .IsRequired(false);

        builder.Property(w => w.StartYear)
            .IsRequired()
            .HasMaxLength(10);

        builder.Property(w => w.EndYear)
            .HasMaxLength(10)
            .IsRequired(false);

        builder.Property(w => w.IsCurrentPosition)
            .IsRequired();

        builder.Property(w => w.CreatedAt)
            .IsRequired();

        builder.Property(w => w.UpdatedAt)
            .IsRequired();

        builder.HasOne(w => w.Professional)
            .WithMany(p => p.WorkExperiences)
            .HasForeignKey(w => w.ProfessionalId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(w => w.ProfessionalId);
    }
}
