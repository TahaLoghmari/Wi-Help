using Modules.Common.Features.Abstractions;

namespace Modules.Professionals.Features.Awards.CreateAward;

public record CreateAwardCommand(
    Guid ProfessionalId,
    string Title,
    string? Issuer,
    string? Description,
    string YearReceived) : ICommand;
