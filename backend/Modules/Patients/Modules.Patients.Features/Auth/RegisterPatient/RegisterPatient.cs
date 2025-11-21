using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.ValueObjects;

namespace Modules.Patients.Features.Auth.RegisterPatient;

internal sealed class RegisterPatient : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(PatientsEndpoints.RegisterPatient, async (
                Request request,
                ICommandHandler<RegisterPatientCommand> handler,
                CancellationToken cancellationToken) =>
            {
                RegisterPatientCommand command = new RegisterPatientCommand(
                    request.Email,
                    request.Password,
                    request.ConfirmPassword,
                    request.FirstName,
                    request.LastName,
                    request.DateOfBirth,
                    request.Gender,
                    request.PhoneNumber,
                    request.Address,
                    request.EmergencyContact);

                Result result = await handler.Handle(command, cancellationToken);
                return result.Match(() => Results.Ok(), CustomResults.Problem);
            })
            .WithTags(Tags.Patients);
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
        EmergencyContact EmergencyContact);
}
