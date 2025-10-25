using Microsoft.AspNetCore.Routing;

namespace Modules.Common.Features.Abstractions;

public interface IEndpoint
{
    static abstract void MapEndpoint(IEndpointRouteBuilder app);
}