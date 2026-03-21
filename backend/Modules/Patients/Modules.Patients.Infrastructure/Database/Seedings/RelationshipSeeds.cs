using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Infrastructure.Database.Seedings;

internal static class RelationshipSeeds
{
    public static readonly Relationship[] All =
    [
        new(new Guid("00000005-0000-0000-0000-000000000001"), "relationships.parent"),
        new(new Guid("00000005-0000-0000-0000-000000000002"), "relationships.child"),
        new(new Guid("00000005-0000-0000-0000-000000000003"), "relationships.spouse"),
        new(new Guid("00000005-0000-0000-0000-000000000004"), "relationships.partner"),
        new(new Guid("00000005-0000-0000-0000-000000000005"), "relationships.sibling"),
        new(new Guid("00000005-0000-0000-0000-000000000006"), "relationships.grandparent"),
        new(new Guid("00000005-0000-0000-0000-000000000007"), "relationships.grandchild"),
        new(new Guid("00000005-0000-0000-0000-000000000008"), "relationships.relative"),
        new(new Guid("00000005-0000-0000-0000-000000000009"), "relationships.friend"),
        new(new Guid("00000005-0000-0000-0000-000000000010"), "relationships.neighbor"),
        new(new Guid("00000005-0000-0000-0000-000000000011"), "relationships.caregiver"),
        new(new Guid("00000005-0000-0000-0000-000000000012"), "relationships.guardian"),
        new(new Guid("00000005-0000-0000-0000-000000000013"), "relationships.doctor"),
        new(new Guid("00000005-0000-0000-0000-000000000014"), "relationships.nurse"),
        new(new Guid("00000005-0000-0000-0000-000000000015"), "relationships.colleague"),
        new(new Guid("00000005-0000-0000-0000-000000000016"), "relationships.other"),
    ];
}
