using FluentValidation;
using Modules.Identity.Features.Auth.Login;

namespace Modules.Identity.Features.Auth.Login;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.LoginUserDto.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Email must be a valid email address.");

        RuleFor(x => x.LoginUserDto.Password)
            .NotEmpty().WithMessage("Password is required.");
    }
}
