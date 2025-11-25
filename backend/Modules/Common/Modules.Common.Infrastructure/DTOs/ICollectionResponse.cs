namespace Modules.Common.Infrastructure.DTOs;

public interface ICollectionResponse<T>
{
    List<T> Items { get; set; }
}