using Microsoft.AspNetCore.Identity;

namespace Modules.Identity.Domain.Entities;

public sealed class User : IdentityUser<Guid>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public Uri? ProfilePictureUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public ICollection<RefreshToken> RefreshTokens { get; } = new List<RefreshToken>();
}
