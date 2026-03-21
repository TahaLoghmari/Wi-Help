using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Infrastructure.Database.Seedings;

namespace Modules.Patients.Infrastructure.Database.Configurations;

public class RelationshipConfiguration : IEntityTypeConfiguration<Relationship>
{
    public void Configure(EntityTypeBuilder<Relationship> builder)
    {
        builder.ToTable("relationships");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Key)
            .HasColumnName("key")
            .IsRequired()
            .HasMaxLength(100);

        builder.HasData(RelationshipSeeds.All);
    }
}
