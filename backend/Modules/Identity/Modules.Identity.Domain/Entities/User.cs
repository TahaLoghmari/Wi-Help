using Microsoft.AspNetCore.Identity;

namespace Modules.Identity.Domain.Entities;

public sealed class User : IdentityUser<Guid>
{
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string Gender { get; private set; } = string.Empty;
    public DateTime DateOfBirth { get; private set; } = DateTime.MinValue;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; private set; } = DateTime.UtcNow;
    public ICollection<RefreshToken> RefreshTokens { get; } = new List<RefreshToken>();

    private User()
    {
    }

    public static User Create(
        string firstName,
        string lastName,
        string dateOfBirth,
        string gender,
        string phoneNumber,
        string email)
    {
        return new User
        {
            FirstName = firstName,
            LastName = lastName,
            Gender = gender,
            DateOfBirth = DateTime.SpecifyKind(DateTime.Parse(dateOfBirth), DateTimeKind.Utc),
            CreatedAt = DateTime.UtcNow,
            Email = email,
            PhoneNumber = phoneNumber,
            UserName = $"{firstName.ToLower()}.{lastName.ToLower()}",
        };
    }
}
