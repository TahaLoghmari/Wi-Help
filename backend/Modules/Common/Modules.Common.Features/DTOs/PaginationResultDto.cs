namespace Modules.Common.Features.DTOs;
public sealed record PaginationResultDto<T> : ICollectionResponse<T>
{
    public required List<T> Items { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;
    public static PaginationResultDto<T> Create(
        List<T> items, int page, int pageSize, int totalCount)
    {
        return new PaginationResultDto<T>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }
}
