using Modules.Common.Features.Abstractions;

namespace Modules.Appointments.Features.DeletePrescription;

public sealed record DeletePrescriptionCommand(Guid PrescriptionId) : ICommand;
