using Modules.Common.Features.Abstractions;
using Modules.Professionals.Features.GetVerificationDocuments;

namespace Modules.Professionals.Features.GetProfessionalDocuments;

public record GetProfessionalDocumentsQuery(Guid ProfessionalId) : IQuery<List<VerificationDocumentDto>>;
