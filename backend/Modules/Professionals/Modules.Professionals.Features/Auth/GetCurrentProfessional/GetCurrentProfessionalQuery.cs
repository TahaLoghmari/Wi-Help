using Modules.Common.Features.Abstractions;

namespace Modules.Professionals.Features.Auth.GetCurrentProfessional;

public sealed record GetCurrentProfessionalQuery(Guid UserId) : IQuery<ProfessionalProfileDto>;
