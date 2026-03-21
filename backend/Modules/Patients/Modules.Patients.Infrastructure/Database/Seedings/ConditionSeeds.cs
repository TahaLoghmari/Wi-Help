using Modules.Patients.Domain.Entities;

namespace Modules.Patients.Infrastructure.Database.Seedings;

internal static class ConditionSeeds
{
    public static readonly Condition[] All =
    [
        new(new Guid("00000007-0000-0000-0000-000000000001"), "conditions.hypertension"),
        new(new Guid("00000007-0000-0000-0000-000000000002"), "conditions.diabetesType1"),
        new(new Guid("00000007-0000-0000-0000-000000000003"), "conditions.diabetesType2"),
        new(new Guid("00000007-0000-0000-0000-000000000004"), "conditions.asthma"),
        new(new Guid("00000007-0000-0000-0000-000000000005"), "conditions.arthritis"),
        new(new Guid("00000007-0000-0000-0000-000000000006"), "conditions.heartDisease"),
        new(new Guid("00000007-0000-0000-0000-000000000007"), "conditions.copd"),
        new(new Guid("00000007-0000-0000-0000-000000000008"), "conditions.depression"),
        new(new Guid("00000007-0000-0000-0000-000000000009"), "conditions.anxiety"),
        new(new Guid("00000007-0000-0000-0000-000000000010"), "conditions.obesity"),
        new(new Guid("00000007-0000-0000-0000-000000000011"), "conditions.osteoporosis"),
        new(new Guid("00000007-0000-0000-0000-000000000012"), "conditions.chronicKidneyDisease"),
        new(new Guid("00000007-0000-0000-0000-000000000013"), "conditions.alzheimers"),
        new(new Guid("00000007-0000-0000-0000-000000000014"), "conditions.cancer"),
        new(new Guid("00000007-0000-0000-0000-000000000015"), "conditions.stroke"),
    ];
}
