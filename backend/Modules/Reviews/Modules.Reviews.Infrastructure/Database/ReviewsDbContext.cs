using Microsoft.EntityFrameworkCore;
using Modules.Reviews.Domain.Entities;

namespace Modules.Reviews.Infrastructure.Database;

public sealed class ReviewsDbContext(DbContextOptions<ReviewsDbContext> options) : DbContext(options)
{
    public DbSet<Review> Reviews { get; set; }
    public DbSet<ReviewLike> ReviewLikes { get; set; }
    public DbSet<ReviewReply> ReviewReplies { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.HasDefaultSchema(DbConsts.ReviewsSchemaName);
        builder.ApplyConfigurationsFromAssembly(typeof(ReviewsDbContext).Assembly);
    }
}

