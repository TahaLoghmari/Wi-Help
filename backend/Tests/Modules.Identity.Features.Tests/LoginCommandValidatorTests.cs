using FluentAssertions;
using Modules.Identity.Features.Auth.Login;

namespace Modules.Identity.Features.Tests;

public sealed class LoginCommandValidatorTests
{
    [Fact]
    public void Validate_WhenEmailIsMissing_ReturnsEmailRequiredError()
    {
        var validator = new LoginCommandValidator();

        var result = validator.Validate(new LoginCommand(string.Empty, "password"));

        result.IsValid.Should().BeFalse();
        result.Errors.Should().ContainSingle(error => error.ErrorMessage == "Email is required.");
    }
}
