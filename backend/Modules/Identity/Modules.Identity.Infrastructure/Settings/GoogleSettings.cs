namespace Modules.Identity.Infrastructure.Settings;

public sealed class GoogleSettings
{
    public string? ClientId { get; init; }
    public string? ClientSecret { get; init; }
    public string? RedirectUri { get; init; }
    public string? Scopes { get; init; }
}
