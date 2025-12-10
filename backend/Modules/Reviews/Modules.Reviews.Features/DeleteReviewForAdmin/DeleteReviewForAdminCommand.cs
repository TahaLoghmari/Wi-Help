using Modules.Common.Features.Abstractions;

namespace Modules.Reviews.Features.DeleteReviewForAdmin;

public sealed record DeleteReviewForAdminCommand(Guid ReviewId) : ICommand;
