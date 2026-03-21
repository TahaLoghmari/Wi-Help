using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Infrastructure.Database.Seedings;

namespace Modules.Patients.Infrastructure.Database.Configurations;

public class ConditionConfiguration : IEntityTypeConfiguration<Condition>
{
    public void Configure(EntityTypeBuilder<Condition> builder)
    {
        builder.ToTable("conditions");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Key)
            .HasColumnName("key")
            .IsRequired()
            .HasMaxLength(100);

        builder.HasData(ConditionSeeds.All);
    }
}
