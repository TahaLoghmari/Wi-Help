namespace Modules.Identity.Features;

public static class IdentityEndpoints
{
    public const string Login = "auth/login";
    public const string ForgotPassword = "auth/forgot-password";
    public const string ResetPassword = "auth/reset-password";
    public const string ConfirmEmail = "auth/confirm-email";
    public const string GetCurrentUser = "auth/me";
    public const string Refresh = "auth/refresh";
    public const string Logout = "auth/logout";
    public const string ChangePassword = "auth/change-password";
    public const string BanUser = "identity/users/{userId}/ban";
    public const string AdminChangePassword = "identity/users/{userId}/password";
    public const string UpdateLocation = "users/location";
    
    // Google OAuth
    public const string GoogleAuthorize = "auth/google/authorize";
    public const string GoogleCallback = "auth/google/callback";
}
