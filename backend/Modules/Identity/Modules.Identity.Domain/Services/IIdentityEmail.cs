using Modules.Identity.Domain.Entities;

namespace Modules.Identity.Domain.Services;

public interface IIdentityEmail
{
    Task SendForgotPasswordEmail(string email, User user);
    Task SendConfirmationEmail(User user);
}
