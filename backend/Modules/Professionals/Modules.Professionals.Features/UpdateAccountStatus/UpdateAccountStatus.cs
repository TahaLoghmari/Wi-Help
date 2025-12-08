using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Domain.Enums;

namespace Modules.Professionals.Features.UpdateAccountStatus;

internal sealed class UpdateAccountStatus : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(ProfessionalsEndpoints.UpdateAccountStatus, async (
                Guid professionalId,
                [AsParameters] Request request,
                ICommandHandler<UpdateAccountStatusCommand> handler,
                CancellationToken cancellationToken) =>
            {
                var command = new UpdateAccountStatusCommand(professionalId, request.Status);
                Result result = await handler.Handle(command, cancellationToken);

                return result.Match(Results.NoContent, CustomResults.Problem);
            })
            .WithTags(Tags.Professionals)
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
    }

    public sealed record Request(VerificationStatus Status);
}
