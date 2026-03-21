using Modules.Common.Features.Abstractions;

namespace Modules.Patients.Features.GetAllergies;

public sealed record GetAllergiesQuery : IQuery<List<AllergyDto>>;
