using Modules.Common.Features.Abstractions;

namespace Modules.Patients.Features.Auth.GetCurrentPatient;

public sealed record GetCurrentPatientQuery(Guid UserId) : IQuery<GetCurrentPatientDto>;
