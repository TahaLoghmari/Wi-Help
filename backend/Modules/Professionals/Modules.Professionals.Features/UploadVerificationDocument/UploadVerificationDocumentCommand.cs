using Microsoft.AspNetCore.Http;
using Modules.Common.Features.Abstractions;
using Modules.Professionals.Domain.Entities;

namespace Modules.Professionals.Features.UploadVerificationDocument;

public sealed record UploadVerificationDocumentCommand(
    Guid UserId,
    DocumentType DocumentType,
    IFormFile Document) : ICommand;
