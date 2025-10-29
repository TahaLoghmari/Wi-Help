using Microsoft.EntityFrameworkCore;
using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Infrastructure.Database;
public sealed class PatientsDbContext(DbContextOptions<PatientsDbContext> options) : DbContext(options)
{
    
    public DbSet<Patient> Patients { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder); 
        builder.HasDefaultSchema(DbConsts.PatientsSchemaName);
        builder.ApplyConfigurationsFromAssembly(typeof(PatientsDbContext).Assembly);
    }
}