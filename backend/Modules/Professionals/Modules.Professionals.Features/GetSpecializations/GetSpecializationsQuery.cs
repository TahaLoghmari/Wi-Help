using Modules.Common.Features.Abstractions;

namespace Modules.Professionals.Features.GetSpecializations;

public sealed record GetSpecializationsQuery : IQuery<List<SpecializationDto>>;
