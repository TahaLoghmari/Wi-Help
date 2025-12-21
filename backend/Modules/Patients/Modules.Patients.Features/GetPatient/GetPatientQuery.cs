using Modules.Common.Features.Abstractions;

namespace Modules.Patients.Features.GetPatient;

public sealed record GetPatientQuery(
    Guid PatientId,
    double? RequesterLatitude = null,
    double? RequesterLongitude = null) : IQuery<GetPatientDto>;
