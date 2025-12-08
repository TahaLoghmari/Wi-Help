using Modules.Appointments.Domain.Enums;
using Modules.Common.Features.Abstractions;

namespace Modules.Appointments.Features.UpdateAppointmentStatusByAdmin;

public sealed record UpdateAppointmentStatusByAdminCommand(
    Guid AppointmentId,
    AppointmentStatus Status) : ICommand;
