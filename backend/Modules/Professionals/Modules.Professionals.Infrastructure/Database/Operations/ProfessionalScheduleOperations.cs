using Microsoft.EntityFrameworkCore;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Domain.Ports;

namespace Modules.Professionals.Infrastructure.Database.Operations;

internal sealed class ProfessionalScheduleOperations(ProfessionalsDbContext dbContext) : IProfessionalScheduleOperations
{
    public async Task<IReadOnlyList<AvailabilityDay>> GetAvailabilityDaysAsync(Guid professionalId, CancellationToken cancellationToken) =>
        await dbContext.AvailabilityDays.Include(day => day.AvailabilitySlots)
            .Where(day => day.ProfessionalId == professionalId).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<AvailabilityDay>> GetAvailabilityDaysReadOnlyAsync(Guid professionalId, CancellationToken cancellationToken) =>
        await dbContext.AvailabilityDays.Include(day => day.AvailabilitySlots).AsNoTracking()
            .Where(day => day.ProfessionalId == professionalId).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<AvailabilitySlot>> GetAvailabilitySlotsAsync(Guid availabilityDayId, CancellationToken cancellationToken) =>
        await dbContext.AvailabilitySlots.Where(slot => slot.AvailabilityDayId == availabilityDayId).ToListAsync(cancellationToken);

    public void AddAvailabilityDay(AvailabilityDay availabilityDay) => dbContext.AvailabilityDays.Add(availabilityDay);
    public void AddAvailabilitySlot(AvailabilitySlot availabilitySlot) => dbContext.AvailabilitySlots.Add(availabilitySlot);
    public void RemoveAvailabilitySlots(IEnumerable<AvailabilitySlot> availabilitySlots) => dbContext.AvailabilitySlots.RemoveRange(availabilitySlots);
    public Task SaveChangesAsync(CancellationToken cancellationToken) => dbContext.SaveChangesAsync(cancellationToken);
}
