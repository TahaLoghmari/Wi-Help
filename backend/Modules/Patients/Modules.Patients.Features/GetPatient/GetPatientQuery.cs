using Modules.Common.Features.Abstractions;
using Modules.Patients.Infrastructure.DTOs;

namespace Modules.Patients.Features.GetPatient;

public sealed record GetPatientQuery(Guid PatientId) : IQuery<PatientProfileDto>;
