using Modules.Common.Features.Abstractions;
using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Features.UpdateDocumentStatus;

public record UpdateDocumentStatusCommand(Guid DocumentId, DocumentStatus Status) : ICommand;
