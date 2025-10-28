using Microsoft.EntityFrameworkCore;
using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Infrastructure;
public sealed class PatientDbContext(DbContextOptions<PatientDbContext> options) : DbContext(options)
{
    
    public DbSet<Patient> Patients { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.HasDefaultSchema("patients");
        base.OnModelCreating(builder); 
        builder.ApplyConfigurationsFromAssembly(typeof(PatientDbContext).Assembly);
    }
}