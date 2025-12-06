using Modules.Common.Features.Abstractions;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Appointments.Features.GetPatientPrescriptions;

public sealed record GetPatientPrescriptionsQuery(Guid UserId, int Page, int PageSize) : IQuery<PaginationResultDto<PrescriptionDto>>;
