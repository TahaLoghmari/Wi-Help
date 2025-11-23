using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Infrastructure.Database.Configurations;

public class AvailabilityDayConfiguration :  IEntityTypeConfiguration<AvailabilityDay>
{
    public void Configure(EntityTypeBuilder<AvailabilityDay> builder)
    {
        builder.ToTable("availability_days");

        builder.HasKey(ad => ad.Id);

        builder.Property(ad => ad.ProfessionalId)
            .IsRequired();

        builder.Property(ad => ad.DayOfWeek)
            .IsRequired();

        builder.HasOne(ad => ad.Professional)
            .WithMany(p => p.AvailabilityDays)
            .HasForeignKey(ad => ad.ProfessionalId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(ad => ad.AvailabilitySlots)
            .WithOne(aslot => aslot.Day)
            .HasForeignKey(aslot => aslot.AvailabilityDayId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}