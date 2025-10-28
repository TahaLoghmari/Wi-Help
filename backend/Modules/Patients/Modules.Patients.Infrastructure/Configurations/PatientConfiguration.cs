using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Infrastructure.Configurations;

public class PatientConfiguration : IEntityTypeConfiguration<Patient>
{
    public void Configure(EntityTypeBuilder<Patient> builder)
    {
        builder.ToTable("patients");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.UserId)
            .IsRequired();

        builder.OwnsOne(p => p.DefaultAddress, address =>
        {
            address.Property(a => a.Street).HasMaxLength(200);
            address.Property(a => a.City).HasMaxLength(100);
            address.Property(a => a.PostalCode).HasMaxLength(20);
            address.Property(a => a.Country).HasMaxLength(100);
            address.Property(a => a.Latitude).IsRequired();
            address.Property(a => a.Longitude).IsRequired();
        });

        builder.OwnsOne(p => p.EmergencyContact, contact =>
        {
            contact.Property(c => c.FullName).IsRequired().HasMaxLength(100);
            contact.Property(c => c.PhoneNumber).IsRequired().HasMaxLength(20);
            contact.Property(c => c.Relationship).IsRequired().HasMaxLength(50);
        });

    }
}
