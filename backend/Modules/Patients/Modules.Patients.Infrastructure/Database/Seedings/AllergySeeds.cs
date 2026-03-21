using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Infrastructure.Database.Seedings;

internal static class AllergySeeds
{
    public static readonly Allergy[] All =
    [
        new(new Guid("00000006-0000-0000-0000-000000000001"), "allergies.peanuts"),
        new(new Guid("00000006-0000-0000-0000-000000000002"), "allergies.treeNuts"),
        new(new Guid("00000006-0000-0000-0000-000000000003"), "allergies.milk"),
        new(new Guid("00000006-0000-0000-0000-000000000004"), "allergies.egg"),
        new(new Guid("00000006-0000-0000-0000-000000000005"), "allergies.wheat"),
        new(new Guid("00000006-0000-0000-0000-000000000006"), "allergies.soy"),
        new(new Guid("00000006-0000-0000-0000-000000000007"), "allergies.fish"),
        new(new Guid("00000006-0000-0000-0000-000000000008"), "allergies.shellfish"),
        new(new Guid("00000006-0000-0000-0000-000000000009"), "allergies.sesame"),
        new(new Guid("00000006-0000-0000-0000-000000000010"), "allergies.penicillin"),
        new(new Guid("00000006-0000-0000-0000-000000000011"), "allergies.latex"),
        new(new Guid("00000006-0000-0000-0000-000000000012"), "allergies.pollen"),
        new(new Guid("00000006-0000-0000-0000-000000000013"), "allergies.dustMites"),
        new(new Guid("00000006-0000-0000-0000-000000000014"), "allergies.petDander"),
        new(new Guid("00000006-0000-0000-0000-000000000015"), "allergies.insectStings"),
    ];
}
