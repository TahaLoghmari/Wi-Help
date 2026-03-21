using Microsoft.EntityFrameworkCore;
using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Infrastructure.Database;
public sealed class PatientsDbContext(DbContextOptions<PatientsDbContext> options) : DbContext(options)
{
    
    public DbSet<Patient> Patients { get; set; }
    public DbSet<Relationship> Relationships { get; set; }
    public DbSet<Allergy> Allergies { get; set; }
    public DbSet<Condition> Conditions { get; set; }
    public DbSet<Medication> Medications { get; set; }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Properties<Enum>()
            .HaveConversion<string>();
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder); 
        builder.HasDefaultSchema(DbConsts.PatientsSchemaName);
        builder.ApplyConfigurationsFromAssembly(typeof(PatientsDbContext).Assembly);
    }
}