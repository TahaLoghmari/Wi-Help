using Modules.Common.Features.Abstractions;
using Modules.Common.Infrastructure.DTOs;
using Modules.Patients.PublicApi.Contracts;

namespace Modules.Appointments.Features.GetProfessionalPatients;

public sealed record GetProfessionalPatientsQuery(Guid UserId, int Page, int PageSize) : IQuery<PaginationResultDto<PatientDto>>;
