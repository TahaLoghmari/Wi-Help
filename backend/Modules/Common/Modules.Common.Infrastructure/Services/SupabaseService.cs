using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Supabase.Storage;
using FileOptions = Supabase.Storage.FileOptions;

namespace Modules.Common.Infrastructure.Services;

public class SupabaseService 
{
    public readonly Supabase.Client _client;
    public readonly string _supabaseUrl;

    public SupabaseService(IOptions<SupabaseSettings> options)
    {
        var supabaseOptions = new Supabase.SupabaseOptions
        {
            AutoConnectRealtime = false
        };
        _supabaseUrl = options.Value.Url;
        _client = new Supabase.Client(
            options.Value.Url,
            options.Value.ServiceRoleKey,
            supabaseOptions
        );
    }
    
    public async Task InitializeAsync()
    {
        await _client.InitializeAsync();
    }

    public async Task<string> UploadFileAsync(
        IFormFile file,
        string name,
        string bucketName,
        CancellationToken cancellationToken = default)
    {
        var ext        = Path.GetExtension(file.FileName); 
        var objectPath = $"{name}_{Guid.NewGuid():N}{ext}";

        byte[] buffer;
        await using (var ms = new MemoryStream())
        {
            await file.CopyToAsync(ms,cancellationToken);
            buffer = ms.ToArray();
        }

        var bucket = _client.Storage.From($"{bucketName}");
        await bucket.Upload(
            buffer,          
            objectPath,        
            new FileOptions
            {
                CacheControl = "3600",
                Upsert       = false,
                ContentType  = file.ContentType
            });
        return $"{_supabaseUrl}/storage/v1/object/public/{bucketName}/{objectPath}";
    }

    public async Task<byte[]> DownloadFileAsync(string url, string bucketName)
    {
        var objectPath = url.Replace($"{_supabaseUrl}/storage/v1/object/public/{bucketName}/", "");
        return await _client.Storage.From($"{bucketName}").Download(objectPath, (TransformOptions?)null, (EventHandler<float>?)null);
    }
    
    public async Task DeleteFileAsync(string url, string bucketName)
    {
        var objectPath = url.Replace($"{_supabaseUrl}/storage/v1/object/public/{bucketName}/", "");
        await _client.Storage.From($"{bucketName}").Remove(new List<string> { objectPath });
    }
}
