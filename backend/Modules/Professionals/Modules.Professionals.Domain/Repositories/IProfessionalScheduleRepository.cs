using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Domain.Repositories;

public interface IProfessionalScheduleRepository
{
    Task<IReadOnlyList<AvailabilityDay>> GetAvailabilityDaysAsync(Guid professionalId, CancellationToken cancellationToken);
    Task<IReadOnlyList<AvailabilityDay>> GetAvailabilityDaysReadOnlyAsync(Guid professionalId, CancellationToken cancellationToken);
    Task<IReadOnlyList<AvailabilitySlot>> GetAvailabilitySlotsAsync(Guid availabilityDayId, CancellationToken cancellationToken);
    void AddAvailabilityDay(AvailabilityDay availabilityDay);
    void AddAvailabilitySlot(AvailabilitySlot availabilitySlot);
    void RemoveAvailabilitySlots(IEnumerable<AvailabilitySlot> availabilitySlots);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
