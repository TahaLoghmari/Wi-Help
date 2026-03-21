using Modules.Common.Features.ValueObjects;

namespace Modules.Identity.Infrastructure.Database.Seedings;

internal static class PatientUserSeeds
{
    public static readonly (string Email, string Password, string FirstName, string LastName, string DateOfBirth, string Gender, string PhoneNumber, Address Address)[] All =
    [
        (
            "heyitsmetahaa@gmail.com",
            "Tahalog12#",
            "Taha",
            "Ghmari",
            "1998-01-27 00:00:00.000 +0100",
            "Male",
            "93204776",
            new Address("22 Rue El Farabi", "Ariana", "2080",
                new Guid("00000002-0000-0000-0000-000000000125"), // Tunisia
                new Guid("00000003-0000-0000-0000-000000000085")) // Ariana
        ),
        (
            "mohamedtahaloghmari@gmail.com",
            "Tahalog12#",
            "Ali",
            "Ghmari",
            "1993-06-11 00:00:00.000 +0100",
            "Male",
            "25991463",
            new Address("5 Rue de l'Environnement", "Nabeul", "8000",
                new Guid("00000002-0000-0000-0000-000000000125"), // Tunisia
                new Guid("00000003-0000-0000-0000-000000000088")) // Nabeul
        ),
    ];
}
