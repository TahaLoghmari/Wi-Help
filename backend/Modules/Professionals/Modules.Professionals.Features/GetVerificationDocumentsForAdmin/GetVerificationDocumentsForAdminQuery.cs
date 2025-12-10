using Modules.Common.Features.Abstractions;
using Modules.Common.Infrastructure.DTOs;

namespace Modules.Professionals.Features.GetVerificationDocumentsForAdmin;

public sealed record GetVerificationDocumentsForAdminQuery(int Page, int PageSize) : IQuery<PaginationResultDto<ProfessionalVerificationDto>>;
