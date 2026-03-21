using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Infrastructure.Database.Seedings;

namespace Modules.Professionals.Infrastructure.Database.Configurations;

public class SpecializationConfiguration : IEntityTypeConfiguration<Specialization>
{
    public void Configure(EntityTypeBuilder<Specialization> builder)
    {
        builder.ToTable("specializations");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Key)
            .HasColumnName("key")
            .IsRequired()
            .HasMaxLength(100);

        builder.HasMany(s => s.Services)
            .WithMany()
            .UsingEntity<Dictionary<string, object>>(
                "specialization_services",
                r => r.HasOne<Service>().WithMany().HasForeignKey("service_id").OnDelete(DeleteBehavior.Cascade),
                l => l.HasOne<Specialization>().WithMany().HasForeignKey("specialization_id").OnDelete(DeleteBehavior.Cascade),
                je =>
                {
                    je.ToTable("specialization_services");
                    je.HasKey("specialization_id", "service_id");
                    je.HasData(SpecializationServiceSeeds.All);
                });

        builder.HasData(SpecializationSeeds.All);
    }
}
