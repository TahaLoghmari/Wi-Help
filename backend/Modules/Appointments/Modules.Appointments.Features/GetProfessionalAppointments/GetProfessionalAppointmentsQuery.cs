using Modules.Common.Features.Abstractions;
using Modules.Common.Features.DTOs;

namespace Modules.Appointments.Features.GetProfessionalAppointments;

public sealed record GetProfessionalAppointmentsQuery(Guid UserId, int Page, int PageSize) : IQuery<PaginationResultDto<GetProfessionalAppointmentsDto>>;
