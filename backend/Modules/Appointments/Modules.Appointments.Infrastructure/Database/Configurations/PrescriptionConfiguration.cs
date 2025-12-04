using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Appointments.Domain.Entities;

namespace Modules.Appointments.Infrastructure.Database.Configurations;

public class PrescriptionConfiguration : IEntityTypeConfiguration<Prescription>
{
    public void Configure(EntityTypeBuilder<Prescription> builder)
    {
        builder.ToTable("prescriptions");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.AppointmentId).IsRequired();
        builder.Property(p => p.PatientId).IsRequired();
        builder.Property(p => p.ProfessionalId).IsRequired();
        
        builder.Property(p => p.PdfUrl)
            .HasMaxLength(500)
            .IsRequired();
        
        builder.Property(p => p.Title)
            .HasMaxLength(200)
            .IsRequired(false);
        
        builder.Property(p => p.Notes)
            .HasMaxLength(1000)
            .IsRequired(false);
        
        builder.Property(p => p.IssuedAt).IsRequired();
        builder.Property(p => p.CreatedAt).IsRequired();
        builder.Property(p => p.UpdatedAt).IsRequired();

        // Index for efficient querying by patient
        builder.HasIndex(p => p.PatientId);
        
        // Index for efficient querying by appointment
        builder.HasIndex(p => p.AppointmentId);
        
        // Index for efficient querying by professional
        builder.HasIndex(p => p.ProfessionalId);
    }
}
