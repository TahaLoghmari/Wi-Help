using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Infrastructure.Database.Seedings;

namespace Modules.Patients.Infrastructure.Database.Configurations;

public class AllergyConfiguration : IEntityTypeConfiguration<Allergy>
{
    public void Configure(EntityTypeBuilder<Allergy> builder)
    {
        builder.ToTable("allergies");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Key)
            .HasColumnName("key")
            .IsRequired()
            .HasMaxLength(100);

        builder.HasData(AllergySeeds.All);
    }
}
