using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Appointments.Domain.Entities;

namespace Modules.Appointments.Infrastructure.Database.Configurations;

public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
{
    public void Configure(EntityTypeBuilder<Appointment> builder)
    {
        builder.ToTable("appointments");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.PatientId).IsRequired();
        builder.Property(a => a.ProfessionalId).IsRequired();
        
        builder.Property(a => a.Notes).HasMaxLength(1000);
        
        builder.Property(a => a.StartDate).IsRequired();
        builder.Property(a => a.EndDate).IsRequired();
        
        builder.Property(a => a.Urgency).IsRequired();
        builder.Property(a => a.Status).IsRequired();
        
        builder.Property(a => a.CreatedAt).IsRequired();
        builder.Property(a => a.UpdatedAt).IsRequired();
    }
}
