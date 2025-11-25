using Modules.Common.Features.Abstractions;

namespace Modules.Patients.Features.GetPatient;

public sealed record GetPatientQuery(Guid PatientId) : IQuery<GetPatientDto>;
