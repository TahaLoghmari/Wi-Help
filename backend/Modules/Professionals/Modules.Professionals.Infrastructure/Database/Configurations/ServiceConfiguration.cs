using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Infrastructure.Database.Seedings;

namespace Modules.Professionals.Infrastructure.Database.Configurations;

public class ServiceConfiguration : IEntityTypeConfiguration<Service>
{
    public void Configure(EntityTypeBuilder<Service> builder)
    {
        builder.ToTable("services");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Key)
            .HasColumnName("key")
            .IsRequired()
            .HasMaxLength(100);

        builder.HasData(ServiceSeeds.All);
    }
}
