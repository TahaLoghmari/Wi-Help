using Modules.Common.Features.Abstractions;

namespace Modules.Professionals.Features.GetServices;

public sealed record GetServicesQuery(Guid SpecializationId) : IQuery<List<ServiceDto>>;
