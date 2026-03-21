using Modules.Common.Features.ValueObjects;

namespace Modules.Identity.Infrastructure.Database.Seedings;

internal static class ProfessionalUserSeeds
{
    public static readonly (string Email, string Password, string FirstName, string LastName, string DateOfBirth, string Gender, string PhoneNumber, Address Address)[] All =
    [
        (
            "forTestingPurposes@gmail.com",
            "Tahalog12#",
            "Mohamed",
            "BenSalah",
            "1986-04-18 00:00:00.000 +0100",
            "Male",
            "22451889",
            new Address("14 Rue Ibn Sina", "Tunis", "1006",
                new Guid("00000002-0000-0000-0000-000000000125"), // Tunisia
                new Guid("00000003-0000-0000-0000-000000000084")) // Tunis
        ),
        (
            "tahaloooghmari@gmail.com",
            "Tahalog12#",
            "Amina",
            "Trabelsi",
            "1991-09-03 00:00:00.000 +0100",
            "Female",
            "55783214",
            new Address("7 Avenue Habib Bourguiba", "Sousse", "4000",
                new Guid("00000002-0000-0000-0000-000000000125"), // Tunisia
                new Guid("00000003-0000-0000-0000-000000000095")) // Sousse
        ),
    ];
}
