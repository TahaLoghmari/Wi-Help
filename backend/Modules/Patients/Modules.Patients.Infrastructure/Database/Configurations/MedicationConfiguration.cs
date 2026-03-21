using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Infrastructure.Database.Seedings;

namespace Modules.Patients.Infrastructure.Database.Configurations;

public class MedicationConfiguration : IEntityTypeConfiguration<Medication>
{
    public void Configure(EntityTypeBuilder<Medication> builder)
    {
        builder.ToTable("medications");

        builder.HasKey(m => m.Id);

        builder.Property(m => m.Key)
            .HasColumnName("key")
            .IsRequired()
            .HasMaxLength(100);

        builder.HasData(MedicationSeeds.All);
    }
}
