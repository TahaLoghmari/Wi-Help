using Modules.Common.Features.Abstractions;
using Modules.Common.Infrastructure.DTOs;
using Modules.Patients.PublicApi.Contracts;

namespace Modules.Appointments.Features.GetProfessionalPatients;

public sealed record GetProfessionalPatientsQuery(Guid ProfessionalId, int Page, int PageSize) : IQuery<PaginationResultDto<PatientDto>>;
