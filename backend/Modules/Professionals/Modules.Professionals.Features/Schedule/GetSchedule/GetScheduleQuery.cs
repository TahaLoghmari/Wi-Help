using Modules.Common.Features.Abstractions;

namespace Modules.Professionals.Features.Schedule.Get;

public record GetScheduleQuery(Guid ProfessionalId) : IQuery<GetScheduleDto>;
