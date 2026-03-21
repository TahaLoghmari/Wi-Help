using Microsoft.AspNetCore.Http;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.ValueObjects;

namespace Modules.Professionals.Features.Auth.UpdateProfessional;

public sealed record UpdateProfessionalCommand(
    Guid UserId,
    string? FirstName,
    string? LastName,
    string? PhoneNumber,
    Address? Address,
    Guid? SpecializationId,
    int? Experience,
    int? VisitPrice,
    string? Bio,
    IFormFile? ProfilePicture,
    List<Guid>? ServiceIds = null) : ICommand;
