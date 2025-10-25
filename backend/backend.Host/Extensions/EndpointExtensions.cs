using Modules.Common.Features.Abstractions;

namespace backend.Host.Extensions;

public static class EndpointExtensions
{
    public static void MapEndpoints(this WebApplication app)
    {
        var endpointTypes = typeof(Program).Assembly
            .GetTypes()
            .Where(t => t.IsAssignableTo(typeof(IEndpoint)) && t != typeof(IEndpoint));

        foreach (var type in endpointTypes)
        {
            type.GetMethod("MapEndpoint")?.Invoke(null, new object[] { app });
        }
    }
}
