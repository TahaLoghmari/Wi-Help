using Modules.Common.Features.Abstractions;
using Modules.Patients.PublicApi.Contracts;

namespace Modules.Appointments.Features.GetProfessionalPatients;

public sealed record GetProfessionalPatientsQuery(Guid UserId) : IQuery<List<PatientDto>>;
