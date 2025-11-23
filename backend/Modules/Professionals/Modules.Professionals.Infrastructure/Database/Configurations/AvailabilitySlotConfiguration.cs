using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Infrastructure.Database.Configurations;

public class AvailabilitySlotConfiguration : IEntityTypeConfiguration<AvailabilitySlot>
{
    public void Configure(EntityTypeBuilder<AvailabilitySlot> builder)
    {
        builder.ToTable("availability_slots");

        builder.HasKey(aslot => aslot.Id);

        builder.Property(aslot => aslot.AvailabilityDayId)
            .IsRequired();

        builder.OwnsOne(aslot => aslot.TimeRange, tr =>
        {
            tr.Property(tr => tr.StartTime)
                .HasColumnName("start_time")
                .IsRequired();

            tr.Property(tr => tr.EndTime)
                .HasColumnName("end_time")
                .IsRequired();
        });
        

        builder.HasOne(aslot => aslot.Day)
            .WithMany(ad => ad.AvailabilitySlots)
            .HasForeignKey(aslot => aslot.AvailabilityDayId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}