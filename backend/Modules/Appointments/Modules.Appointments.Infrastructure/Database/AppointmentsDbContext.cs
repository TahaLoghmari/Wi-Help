using Microsoft.EntityFrameworkCore;
using Modules.Appointments.Domain.Entities;

namespace Modules.Appointments.Infrastructure.Database;
public sealed class AppointmentsDbContext(DbContextOptions<AppointmentsDbContext> options) : DbContext(options)
{
    
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<Prescription> Prescriptions { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder); 
        builder.HasDefaultSchema(DbConsts.AppointmentsSchemaName);
        builder.ApplyConfigurationsFromAssembly(typeof(AppointmentsDbContext).Assembly);
    }
}