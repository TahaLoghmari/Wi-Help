using Modules.Common.Features.Abstractions;

namespace Modules.Patients.Features.GetMedications;

public sealed record GetMedicationsQuery : IQuery<List<MedicationDto>>;
