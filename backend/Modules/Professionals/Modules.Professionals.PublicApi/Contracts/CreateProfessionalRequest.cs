using Modules.Common.Features.ValueObjects;

namespace Modules.Professionals.PublicApi.Contracts;

public record CreateProfessionalRequest(
    Guid UserId,
    string Specialization,
    int YearsOfExperience,
    Address Address);