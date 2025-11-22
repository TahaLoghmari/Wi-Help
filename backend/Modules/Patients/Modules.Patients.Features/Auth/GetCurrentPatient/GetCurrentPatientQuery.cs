using Modules.Common.Features.Abstractions;
using Modules.Patients.Infrastructure.DTOs;

namespace Modules.Patients.Features.Auth.GetCurrentPatient;

public sealed record GetCurrentPatientQuery(Guid UserId) : IQuery<PatientProfileDto>;
