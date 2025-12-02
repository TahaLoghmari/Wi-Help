using Modules.Common.Features.Abstractions;

namespace Modules.Professionals.Features.Educations.GetEducations;

public record GetEducationsQuery(Guid ProfessionalId) : IQuery<List<EducationDto>>;
