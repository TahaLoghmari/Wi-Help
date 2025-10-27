using FluentValidation;
using Modules.Identity.Features.Auth.Login;

namespace Modules.Identity.Features.Auth.Login;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(c => c.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Email must be a valid email address.");

        RuleFor(c => c.Password)
            .NotEmpty().WithMessage("Password is required.");
    }
}
