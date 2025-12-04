using Modules.Common.Features.Abstractions;

namespace Modules.Appointments.Features.GetPatientPrescriptions;

public record GetPatientPrescriptionsQuery(
    Guid PatientId,
    int PageNumber = 1,
    int PageSize = 10
) : IQuery<PagedResult<PrescriptionDto>>;

public record PagedResult<T>
{
    public List<T> Items { get; init; } = new();
    public int TotalCount { get; init; }
    public int PageNumber { get; init; }
    public int PageSize { get; init; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasNextPage => PageNumber < TotalPages;
    public bool HasPreviousPage => PageNumber > 1;
}
