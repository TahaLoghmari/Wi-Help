using Microsoft.EntityFrameworkCore;
using Modules.Reports.Domain.Entities;

namespace Modules.Reports.Infrastructure.Database;

public class ReportsDbContext(DbContextOptions<ReportsDbContext> options) : DbContext(options)
{
    public DbSet<Report> Reports { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("reports");
        
        modelBuilder.Entity<Report>(builder =>
        {
            builder.HasKey(r => r.Id);
            builder.Property(r => r.Title).IsRequired().HasMaxLength(200);
            builder.Property(r => r.Description).IsRequired().HasMaxLength(1000);
        });
    }
}
