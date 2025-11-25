using Modules.Common.Features.Abstractions;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Appointments.Features.GetProfessionalAppointments;

public sealed record GetProfessionalAppointmentsQuery(Guid UserId, int Page, int PageSize) : IQuery<PaginationResultDto<GetProfessionalAppointmentsDto>>;
