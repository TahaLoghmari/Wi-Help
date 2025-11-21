namespace Modules.Professionals.PublicApi.Contracts;

public record UpdateProfessionalRequest(
    Guid UserId,
    string? Specialization,
    List<string>? Services,
    int? Experience,
    int? StartPrice,
    int? EndPrice,
    string? Bio);
