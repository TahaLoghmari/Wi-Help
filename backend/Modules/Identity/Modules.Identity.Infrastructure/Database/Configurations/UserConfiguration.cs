using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Identity.Domain.Entities;

namespace Modules.Identity.Infrastructure.Database.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.Property(u => u.FirstName)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(u => u.LastName)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(u => u.Gender)
            .IsRequired()
            .HasMaxLength(10);

        builder.Property(u => u.DateOfBirth)
            .IsRequired();
        
        builder.OwnsOne(p => p.Address, address =>
        {
            address.Property(a => a.Street).HasMaxLength(200);
            address.Property(a => a.City).HasMaxLength(100);
            address.Property(a => a.PostalCode).HasMaxLength(20);
            address.Property(a => a.Country).HasMaxLength(100);
            address.Property(a => a.State).HasMaxLength(100);
        });
        
        builder.Property(u => u.ProfilePictureUrl)
            .HasMaxLength(500)  
            .IsRequired(false);  

        builder.Property(u => u.CreatedAt)
            .IsRequired();

        builder.Property(u => u.UpdatedAt)
            .IsRequired(false);

        // Configure Coordinates as owned type (stored in same table with prefixed columns)
        builder.OwnsOne(u => u.Location, location =>
        {
            location.Property(l => l.Latitude).HasColumnName("location_latitude");
            location.Property(l => l.Longitude).HasColumnName("location_longitude");
            location.Property(l => l.Accuracy).HasColumnName("location_accuracy");
            location.Property(l => l.Timestamp).HasColumnName("location_timestamp");
        });

        builder.HasMany(u => u.RefreshTokens)
            .WithOne(rt => rt.User)
            .HasForeignKey(rt => rt.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
