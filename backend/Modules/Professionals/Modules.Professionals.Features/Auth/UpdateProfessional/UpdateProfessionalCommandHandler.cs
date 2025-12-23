using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Infrastructure.Services;
using Modules.Identity.PublicApi;
using Modules.Professionals.Domain;
using Modules.Professionals.Infrastructure.Database;
using System.Transactions;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Identity.PublicApi.Contracts;

namespace Modules.Professionals.Features.Auth.UpdateProfessional;

public sealed class UpdateProfessionalCommandHandler(
    IIdentityModuleApi identityApi,
    ProfessionalsDbContext dbContext,
    SupabaseService supabaseService,
    ILogger<UpdateProfessionalCommandHandler> logger) : ICommandHandler<UpdateProfessionalCommand>
{
    public async Task<Result> Handle(
        UpdateProfessionalCommand command,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Professional update attempt started for UserId: {UserId}", command.UserId);

        var transactionOptions = new TransactionOptions
        {
            IsolationLevel = IsolationLevel.ReadCommitted,
            Timeout = TransactionManager.DefaultTimeout
        };

        using var transactionScope = new TransactionScope(
            TransactionScopeOption.Required,
            transactionOptions,
            TransactionScopeAsyncFlowOption.Enabled);

        try
        {
            string? profilePictureUrl = "";
            if (command.ProfilePicture is not null)
            {
                profilePictureUrl = await supabaseService.UploadFileAsync(
                    command.ProfilePicture,
                    "profilePicture",
                    "profile-pictures",
                    cancellationToken);
            }

            var updateUserRequest = new UpdateUserRequest(
                command.UserId,
                command.FirstName,
                command.LastName,
                command.PhoneNumber,
                command.Address,
                profilePictureUrl);

            var updateResult = await identityApi.UpdateUserAsync(updateUserRequest, cancellationToken);
            if (!updateResult.IsSuccess)
            {
                logger.LogWarning("Failed to update identity fields for UserId: {UserId}", command.UserId);
                return Result.Failure(updateResult.Error);
            }

            logger.LogInformation("Identity fields updated successfully for UserId: {UserId}", command.UserId);
            
            var professional = await dbContext.Professionals
                .FirstOrDefaultAsync(p => p.UserId == command.UserId, cancellationToken);

            if (professional is null)
            {
                logger.LogWarning("Professional not found for UserId: {UserId}", command.UserId);
                return Result.Failure(ProfessionalErrors.NotFound(command.UserId));
            }

            professional.Update(
                command.Specialization,
                command.Services,
                command.Experience,
                command.VisitPrice,
                command.Bio);

            await dbContext.SaveChangesAsync(cancellationToken);

            logger.LogInformation("Professional updated successfully for UserId: {UserId}, ProfessionalId: {ProfessionalId}",
                command.UserId, professional.Id);

            transactionScope.Complete();
            logger.LogInformation("Transaction completed successfully for UserId: {UserId}", command.UserId);

            return Result.Success();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error during professional update for UserId: {UserId}, transaction will be rolled back", command.UserId);
            throw;
        }
    }
}
