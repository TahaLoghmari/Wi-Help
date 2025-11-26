using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Infrastructure.Database.Configurations;

public class PatientConfiguration : IEntityTypeConfiguration<Patient>
{
    public void Configure(EntityTypeBuilder<Patient> builder)
    {
        builder.ToTable("patients");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.UserId)
            .IsRequired();
        
        builder.Property(p => p.Bio).IsRequired(false);

        builder.OwnsOne(p => p.EmergencyContact, contact =>
        {
            contact.Property(c => c.FullName).IsRequired().HasMaxLength(100);
            contact.Property(c => c.PhoneNumber).IsRequired().HasMaxLength(20);
            contact.Property(c => c.Relationship).IsRequired().HasMaxLength(50);
        });

        builder.OwnsOne(p => p.MedicalInfo, medicalInfo =>
        {
            medicalInfo.Property(m => m.MobilityStatus).IsRequired(false);
            medicalInfo.Property(m => m.ChronicConditions).IsRequired(false);
            medicalInfo.Property(m => m.Allergies).IsRequired(false);
            medicalInfo.Property(m => m.Medications).IsRequired(false);
        });

        builder.Navigation(p => p.MedicalInfo).IsRequired(true);

    }
}
