using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Infrastructure.Database.Seedings;

internal static class SpecializationSeeds
{
    public static readonly Specialization[] All =
    [
        new(new Guid("00000004-0000-0000-0000-000000000001"), "specializations.generalPractitioner"),
        new(new Guid("00000004-0000-0000-0000-000000000002"), "specializations.familyMedicine"),
        new(new Guid("00000004-0000-0000-0000-000000000003"), "specializations.internalMedicine"),
        new(new Guid("00000004-0000-0000-0000-000000000004"), "specializations.generalSurgery"),
        new(new Guid("00000004-0000-0000-0000-000000000005"), "specializations.orthopedicSurgery"),
        new(new Guid("00000004-0000-0000-0000-000000000006"), "specializations.neurosurgery"),
        new(new Guid("00000004-0000-0000-0000-000000000007"), "specializations.plasticSurgery"),
        new(new Guid("00000004-0000-0000-0000-000000000008"), "specializations.cardiothoracicSurgery"),
        new(new Guid("00000004-0000-0000-0000-000000000009"), "specializations.urology"),
        new(new Guid("00000004-0000-0000-0000-000000000010"), "specializations.radiology"),
        new(new Guid("00000004-0000-0000-0000-000000000011"), "specializations.pathology"),
        new(new Guid("00000004-0000-0000-0000-000000000012"), "specializations.emergencyMedicine"),
        new(new Guid("00000004-0000-0000-0000-000000000013"), "specializations.criticalCare"),
        new(new Guid("00000004-0000-0000-0000-000000000014"), "specializations.obstetricsAndGynecology"),
        new(new Guid("00000004-0000-0000-0000-000000000015"), "specializations.pediatrics"),
        new(new Guid("00000004-0000-0000-0000-000000000016"), "specializations.psychiatry"),
        new(new Guid("00000004-0000-0000-0000-000000000017"), "specializations.psychology"),
        new(new Guid("00000004-0000-0000-0000-000000000018"), "specializations.cardiology"),
        new(new Guid("00000004-0000-0000-0000-000000000019"), "specializations.pulmonology"),
        new(new Guid("00000004-0000-0000-0000-000000000020"), "specializations.gastroenterology"),
        new(new Guid("00000004-0000-0000-0000-000000000021"), "specializations.nephrology"),
        new(new Guid("00000004-0000-0000-0000-000000000022"), "specializations.endocrinology"),
        new(new Guid("00000004-0000-0000-0000-000000000023"), "specializations.dermatology"),
        new(new Guid("00000004-0000-0000-0000-000000000024"), "specializations.ophthalmology"),
        new(new Guid("00000004-0000-0000-0000-000000000025"), "specializations.ent"),
        new(new Guid("00000004-0000-0000-0000-000000000026"), "specializations.dentistry"),
        new(new Guid("00000004-0000-0000-0000-000000000027"), "specializations.physiotherapy"),
        new(new Guid("00000004-0000-0000-0000-000000000028"), "specializations.pharmacy"),
        new(new Guid("00000004-0000-0000-0000-000000000029"), "specializations.nursing"),
        new(new Guid("00000004-0000-0000-0000-000000000030"), "specializations.other"),
    ];
}
