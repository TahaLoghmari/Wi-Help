using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Infrastructure.Database.Configurations;

public class AwardConfiguration : IEntityTypeConfiguration<Award>
{
    public void Configure(EntityTypeBuilder<Award> builder)
    {
        builder.ToTable("awards");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.ProfessionalId)
            .IsRequired();

        builder.Property(a => a.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(a => a.Issuer)
            .HasMaxLength(200)
            .IsRequired(false);

        builder.Property(a => a.Description)
            .HasMaxLength(1000)
            .IsRequired(false);

        builder.Property(a => a.YearReceived)
            .IsRequired()
            .HasMaxLength(4);

        builder.Property(a => a.CreatedAt)
            .IsRequired();

        builder.Property(a => a.UpdatedAt)
            .IsRequired();

        builder.HasOne(a => a.Professional)
            .WithMany(p => p.Awards)
            .HasForeignKey(a => a.ProfessionalId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(a => a.ProfessionalId);
    }
}
