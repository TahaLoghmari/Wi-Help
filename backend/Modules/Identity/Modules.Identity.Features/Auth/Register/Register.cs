using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.ValueObjects;

namespace Modules.Identity.Features.Auth.Register;

internal sealed class Register: IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(IdentityEndpoints.Register, async (
                Request request,
                ICommandHandler<RegisterCommand> handler,
                CancellationToken cancellationToken) =>
            {
                RegisterCommand command = new RegisterCommand(
                    request.Email,
                    request.Password,
                    request.ConfirmPassword,
                    request.FirstName,
                    request.LastName,
                    request.DateOfBirth,
                    request.Gender,
                    request.PhoneNumber,
                    request.Role,
                    request.Address,
                    request.EmergencyContact,
                    request.Specialization,
                    request.YearsOfExperience);
                    
                Result result = await handler.Handle(command, cancellationToken);
                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Authentication);
    }
    private sealed record Request(
        string Email,
        string Password,
        string ConfirmPassword,
        string FirstName,
        string LastName,
        string DateOfBirth,
        string Gender,
        string PhoneNumber,
        string Role,
        Address Address,
        EmergencyContact EmergencyContact,
        string? Specialization,
        int? YearsOfExperience);
}