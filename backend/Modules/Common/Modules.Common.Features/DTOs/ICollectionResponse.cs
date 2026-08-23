namespace Modules.Common.Features.DTOs;

public interface ICollectionResponse<T>
{
    List<T> Items { get; set; }
}
