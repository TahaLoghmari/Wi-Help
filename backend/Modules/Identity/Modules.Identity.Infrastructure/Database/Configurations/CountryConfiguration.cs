using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Infrastructure.Database.Seedings;

namespace Modules.Identity.Infrastructure.Database.Configurations;

public class CountryConfiguration : IEntityTypeConfiguration<Country>
{
    public void Configure(EntityTypeBuilder<Country> builder)
    {
        builder.ToTable("countries");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Key)
            .HasColumnName("key")
            .IsRequired()
            .HasMaxLength(100);

        builder.HasData(CountrySeeds.All);
    }
}
