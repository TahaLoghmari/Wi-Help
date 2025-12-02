using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.Features.GetVerificationDocuments;

namespace Modules.Professionals.Features.GetProfessionalDocuments;

internal sealed class GetProfessionalDocuments : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ProfessionalsEndpoints.GetProfessionalDocuments, async (
                [AsParameters] Request request,
                IQueryHandler<GetProfessionalDocumentsQuery, List<VerificationDocumentDto>> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new GetProfessionalDocumentsQuery(request.ProfessionalId);
                var result = await handler.Handle(query, cancellationToken);

                return result.Match(
                    documents => Results.Ok(documents),
                    error => CustomResults.Problem(error));
            })
            .WithTags(Tags.Professionals)
            .RequireAuthorization();
    }

    private class Request
    {
        public Guid ProfessionalId { get; set; }
    }
}
