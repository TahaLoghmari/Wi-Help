using Modules.Common.Features.Abstractions;
using Modules.Professionals.Domain.Enums;

namespace Modules.Professionals.Features.UpdateAccountStatus;

public sealed record UpdateAccountStatusCommand(Guid ProfessionalId, VerificationStatus Status) : ICommand;
