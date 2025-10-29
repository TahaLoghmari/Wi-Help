using Microsoft.EntityFrameworkCore;
using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Infrastructure.Database;
public sealed class ProfessionalsDbContext(DbContextOptions<ProfessionalsDbContext> options) : DbContext(options)
{
    public DbSet<Professional> Professionals { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder); 
        builder.HasDefaultSchema(DbConsts.ProfessionalsSchemaName);
        builder.ApplyConfigurationsFromAssembly(typeof(ProfessionalsDbContext).Assembly);
    }
}