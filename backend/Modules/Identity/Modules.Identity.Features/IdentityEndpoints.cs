namespace Modules.Identity.Features;

public static class IdentityEndpoints
{
    public const string Login = "auth/login";
    public const string ConfirmEmail = "auth/confirm-email";
    public const string GetCurrentUser = "auth/me";
    public const string Refresh = "auth/refresh";
    public const string Logout = "auth/logout";
}
