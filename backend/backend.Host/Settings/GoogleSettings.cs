namespace backend.Host.Settings;

internal sealed class GoogleSettings
{
    public string? ClientId { get; init; }
    public string? ClientSecret { get; init; }
    public string? RedirectUri { get; init; }
    public string? Scopes { get; init; }
}
