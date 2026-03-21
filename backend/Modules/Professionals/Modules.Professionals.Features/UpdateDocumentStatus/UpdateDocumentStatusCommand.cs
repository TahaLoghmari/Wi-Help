using Modules.Common.Features.Abstractions;
using Modules.Professionals.Domain.Entities;
using Modules.Professionals.Domain.Enums;

namespace Modules.Professionals.Features.UpdateDocumentStatus;

public record UpdateDocumentStatusCommand(Guid DocumentId, DocumentStatus Status) : ICommand;
