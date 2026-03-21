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

        builder.Property(p => p.MobilityStatus)
            .HasColumnName("mobility_status")
            .IsRequired(false);

        builder.OwnsOne(p => p.EmergencyContact, contact =>
        {
            contact.Property(c => c.FullName).IsRequired().HasMaxLength(100);
            contact.Property(c => c.PhoneNumber).IsRequired().HasMaxLength(20);
            contact.Property(c => c.RelationshipId).IsRequired(false);
        });

        builder.HasMany(p => p.Allergies)
            .WithMany()
            .UsingEntity<Dictionary<string, object>>(
                "patient_allergies",
                r => r.HasOne<Allergy>().WithMany().HasForeignKey("allergy_id").OnDelete(DeleteBehavior.Cascade),
                l => l.HasOne<Patient>().WithMany().HasForeignKey("patient_id").OnDelete(DeleteBehavior.Cascade),
                je =>
                {
                    je.ToTable("patient_allergies");
                    je.HasKey("patient_id", "allergy_id");
                });

        builder.HasMany(p => p.Conditions)
            .WithMany()
            .UsingEntity<Dictionary<string, object>>(
                "patient_conditions",
                r => r.HasOne<Condition>().WithMany().HasForeignKey("condition_id").OnDelete(DeleteBehavior.Cascade),
                l => l.HasOne<Patient>().WithMany().HasForeignKey("patient_id").OnDelete(DeleteBehavior.Cascade),
                je =>
                {
                    je.ToTable("patient_conditions");
                    je.HasKey("patient_id", "condition_id");
                });

        builder.HasMany(p => p.Medications)
            .WithMany()
            .UsingEntity<Dictionary<string, object>>(
                "patient_medications",
                r => r.HasOne<Medication>().WithMany().HasForeignKey("medication_id").OnDelete(DeleteBehavior.Cascade),
                l => l.HasOne<Patient>().WithMany().HasForeignKey("patient_id").OnDelete(DeleteBehavior.Cascade),
                je =>
                {
                    je.ToTable("patient_medications");
                    je.HasKey("patient_id", "medication_id");
                });
    }
}
