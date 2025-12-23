using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.DependencyInjection;
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

        builder.Property(p => p.Specialization)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.Experience)
            .IsRequired();

        builder.Property(p => p.VisitPrice)
            .IsRequired(false);

        builder.Property(p => p.Bio)
            .HasMaxLength(2000)
            .IsRequired(false);

        builder.Property(p => p.IsVerified)
            .IsRequired();

        builder.Property(p => p.Services)
            .IsRequired(false);
        
        builder.Property(p => p.CreatedAt)
            .IsRequired();

        builder.Property(p => p.UpdatedAt)
            .IsRequired();

    }
}