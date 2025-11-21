using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.ValueObjects;

namespace Modules.Professionals.Features.Auth.RegisterProfessional;

internal sealed class RegisterProfessional : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ProfessionalsEndpoints.RegisterProfessional, async (
                Request request,
                ICommandHandler<RegisterProfessionalCommand> handler,
                CancellationToken cancellationToken) =>
            {
                RegisterProfessionalCommand command = new RegisterProfessionalCommand(
                    request.Email,
                    request.Password,
                    request.ConfirmPassword,
                    request.FirstName,
                    request.LastName,
                    request.DateOfBirth,
                    request.Gender,
                    request.PhoneNumber,
                    request.Address,
                    request.Specialization,
                    request.Experience);

                Result result = await handler.Handle(command, cancellationToken);
                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Professionals);
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
        Address Address,
        string Specialization,
        int Experience);
}
