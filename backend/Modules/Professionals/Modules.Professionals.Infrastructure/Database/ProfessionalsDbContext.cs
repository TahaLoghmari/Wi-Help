using Microsoft.EntityFrameworkCore;
using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Infrastructure.Database;
public sealed class ProfessionalsDbContext(DbContextOptions<ProfessionalsDbContext> options) : DbContext(options)
{
    public DbSet<Professional> Professionals { get; set; }
    public DbSet<AvailabilityDay> AvailabilityDays { get; set; }
    public DbSet<AvailabilitySlot> AvailabilitySlots { get; set; }
    public DbSet<VerificationDocument> VerificationDocuments { get; set; }
    
    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Properties<Enum>()
            .HaveConversion<string>();
    } 
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder); 
        builder.HasDefaultSchema(DbConsts.ProfessionalsSchemaName);
        builder.ApplyConfigurationsFromAssembly(typeof(ProfessionalsDbContext).Assembly);
    }
}