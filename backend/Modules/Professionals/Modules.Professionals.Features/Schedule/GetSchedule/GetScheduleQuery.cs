using Modules.Common.Features.Abstractions;
using Modules.Professionals.Infrastructure.DTOs;

namespace Modules.Professionals.Features.Schedule.Get;

public record GetScheduleQuery(Guid ProfessionalId) : IQuery<GetScheduleDto>;