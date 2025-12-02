using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Infrastructure.Database.Configurations;

public class VerificationDocumentConfiguration : IEntityTypeConfiguration<VerificationDocument>
{
    public void Configure(EntityTypeBuilder<VerificationDocument> builder)
    {
        builder.ToTable("verification_documents");

        builder.HasKey(vd => vd.Id);

        builder.Property(vd => vd.ProfessionalId)
            .IsRequired();

        builder.Property(vd => vd.Type)
            .IsRequired();

        builder.Property(vd => vd.DocumentUrl)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(vd => vd.Status)
            .IsRequired();

        builder.Property(vd => vd.UploadedAt)
            .IsRequired();

        builder.Property(vd => vd.ReviewedAt)
            .IsRequired(false);

        builder.HasOne(vd => vd.Professional)
            .WithMany(p => p.VerificationDocuments)
            .HasForeignKey(vd => vd.ProfessionalId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(vd => new { vd.ProfessionalId, vd.Type })
            .IsUnique();
    }
}
