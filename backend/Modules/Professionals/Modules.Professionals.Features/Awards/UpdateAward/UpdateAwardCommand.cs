using Modules.Common.Features.Abstractions;

namespace Modules.Professionals.Features.Awards.UpdateAward;

public record UpdateAwardCommand(
    Guid ProfessionalId,
    Guid AwardId,
    string? Title,
    string? Issuer,
    string? Description,
    string? YearReceived) : ICommand;
