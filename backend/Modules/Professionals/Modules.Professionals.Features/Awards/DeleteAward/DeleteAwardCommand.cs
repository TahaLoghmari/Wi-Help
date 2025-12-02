using Modules.Common.Features.Abstractions;

namespace Modules.Professionals.Features.Awards.DeleteAward;

public record DeleteAwardCommand(
    Guid ProfessionalId,
    Guid AwardId) : ICommand;
