using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Infrastructure.Database.Seedings;

namespace Modules.Identity.Infrastructure.Database.Configurations;

public class StateConfiguration : IEntityTypeConfiguration<State>
{
    public void Configure(EntityTypeBuilder<State> builder)
    {
        builder.ToTable("states");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Key)
            .HasColumnName("key")
            .IsRequired()
            .HasMaxLength(100);

        builder.HasOne<Country>()
            .WithMany()
            .HasForeignKey(s => s.CountryId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasData(StateSeeds.All);
    }
}
