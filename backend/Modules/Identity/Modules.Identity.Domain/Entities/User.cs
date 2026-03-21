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
    public Coordinates? Location { get; private set; }
    public ICollection<RefreshToken> RefreshTokens { get; } = new List<RefreshToken>();

    public string? GoogleId { get; private set; }
    public bool IsOnboardingCompleted { get; private set; } = true;

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
            UserName = $"{firstName.ToLower()} {lastName.ToLower()}",
            Address = address,
            IsOnboardingCompleted = true,
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
            UserName = $"{FirstName.ToLower()} {LastName.ToLower()}";
        
        if ( !string.IsNullOrWhiteSpace(profilePictureUrl) )
            ProfilePictureUrl = profilePictureUrl;
        
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateLocation(Coordinates coordinates)
    {
        Location = coordinates;
        UpdatedAt = DateTime.UtcNow;
    }

    public static User CreateFromGoogle(
        string googleId,
        string email,
        string firstName,
        string lastName,
        string? profilePictureUrl)
    {
        return new User
        {
            GoogleId = googleId,
            Email = email,
            UserName = email,
            FirstName = firstName,
            LastName = lastName,
            ProfilePictureUrl = profilePictureUrl,
            EmailConfirmed = true,
            IsOnboardingCompleted = false,
            CreatedAt = DateTime.UtcNow,
            Address = new Address(string.Empty, string.Empty, string.Empty, Guid.Empty, Guid.Empty)
        };
    }

    public void UpdateFromGoogle(
        string googleId,
        string? profilePictureUrl)
    {
        GoogleId = googleId;
        if (!string.IsNullOrWhiteSpace(profilePictureUrl))
            ProfilePictureUrl = profilePictureUrl;
        UpdatedAt = DateTime.UtcNow;
    }

    public void CompleteOnboarding(
        string dateOfBirth,
        string gender,
        string phoneNumber,
        Address address)
    {
        DateOfBirth = DateTime.SpecifyKind(DateTime.Parse(dateOfBirth), DateTimeKind.Utc);
        Gender = gender;
        PhoneNumber = phoneNumber;
        Address = address;
        IsOnboardingCompleted = true;
        UpdatedAt = DateTime.UtcNow;
    }
}
