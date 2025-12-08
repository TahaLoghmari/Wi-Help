using Microsoft.AspNetCore.Identity;
using Modules.Common.Features.ValueObjects;

namespace Modules.Identity.Domain.Entities;

public sealed class User : IdentityUser<Guid>
{
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string Gender { get; private set; } = string.Empty;
    public string? ProfilePictureUrl { get; private set; } 
    public Address Address { get; private set; } = null!;
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
        string email,
        Address address)
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
            Address =  address,
        };
    }
    
    public void Update(
        string? firstName = null,
        string? lastName = null,
        string? phoneNumber = null,
        Address? address = null,
        string? profilePictureUrl = null)
    {
        if (!string.IsNullOrWhiteSpace(firstName))
            FirstName = firstName;
        
        if (!string.IsNullOrWhiteSpace(lastName))
            LastName = lastName;
        
        if (!string.IsNullOrWhiteSpace(phoneNumber))
            PhoneNumber = phoneNumber;
        
        if (address != null)
            Address = address;
        
        if (!string.IsNullOrWhiteSpace(firstName) || !string.IsNullOrWhiteSpace(lastName))
            UserName = $"{FirstName.ToLower()}.{LastName.ToLower()}";
        
        if ( !string.IsNullOrWhiteSpace(profilePictureUrl) )
            ProfilePictureUrl = profilePictureUrl;
        
        UpdatedAt = DateTime.UtcNow;
    }
}
