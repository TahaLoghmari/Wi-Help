using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;

namespace Modules.Patients.Features.CreatePatient;

internal sealed class CreatePatient : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(PatientsEndpoints.CreatePatient, async (
                Request request,
                ICommandHandler<CreatePatientCommand> handler,
                CancellationToken cancellationToken) =>
            {
                CreatePatientCommand command = new CreatePatientCommand(
                    request.UserId,
                    request.Street,
                    request.City,
                    request.PostalCode,
                    request.Country,
                    request.Latitude,
                    request.Longitude,
                    request.EmergencyFullName,
                    request.EmergencyPhoneNumber,
                    request.EmergencyRelationship);
                    
                Result result = await handler.Handle(command, cancellationToken);
                return result.Match(() => Results.Ok(), CustomResults.Problem);
            });
    }
    private sealed record Request(
        Guid UserId,
        string Street,
        string City,
        string PostalCode,
        string Country,
        double Latitude,
        double Longitude,
        string EmergencyFullName,
        string EmergencyPhoneNumber,
        string EmergencyRelationship);
}