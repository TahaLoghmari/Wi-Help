using Microsoft.AspNetCore.Http;

namespace Modules.Common.Infrastructure.Services;

public interface IFileStorage
{
    Task<string> UploadFileAsync(
        IFormFile file,
        string name,
        string bucketName,
        CancellationToken cancellationToken = default);

    Task<byte[]> DownloadFileAsync(string url, string bucketName);

    Task DeleteFileAsync(string url, string bucketName);
}
