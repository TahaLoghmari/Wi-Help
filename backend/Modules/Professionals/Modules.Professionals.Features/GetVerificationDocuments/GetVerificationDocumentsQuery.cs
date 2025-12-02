using Modules.Common.Features.Abstractions;

namespace Modules.Professionals.Features.GetVerificationDocuments;

public sealed record GetVerificationDocumentsQuery(Guid UserId) : IQuery<List<VerificationDocumentDto>>;
