using Hangfire;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Professionals.PublicApi;
using Modules.Professionals.PublicApi.Contracts;

namespace Modules.Patients.Features.Appointments.GetProfessionalAvailability;

public class GetProfessionalAvailability : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(PatientsEndpoints.GetProfessionalAvailability,
                async (
                    Guid professionalId,
                    [FromQuery] int year,
                    [FromQuery] int month,
                    [FromQuery] string? timeZoneId,
                    IQueryHandler<GetProfessionalAvailabilityByMonthQuery, MonthlyAvailabilityResponse> handler,
                    CancellationToken cancellationToken) =>
                {
                    var query = new GetProfessionalAvailabilityByMonthQuery(
                        professionalId,
                        year,
                        month,
                        timeZoneId ?? "Africa/Tunis");

                    var result = await handler.Handle(query, cancellationToken);

                    return result.Match(Results.Ok, CustomResults.Problem);
                })
            .RequireAuthorization()
            .WithName("GetProfessionalAvailability")
            .WithTags("Appointments");
        
    }
}


internal sealed class GetProfessionalAvailabilityByMonthQueryHandler(
    IProfessionalModuleApi professionalModuleApi,
    ILogger<GetProfessionalAvailabilityByMonthQueryHandler> logger)
    : IQueryHandler<GetProfessionalAvailabilityByMonthQuery, MonthlyAvailabilityResponse>
{
    public async Task<Result<MonthlyAvailabilityResponse>> Handle(
        GetProfessionalAvailabilityByMonthQuery query,
        CancellationToken cancellationToken)
    {
        try
        {
            var availability = await professionalModuleApi.GetMonthlyAvailability(query);

            logger.LogInformation(
                "Retrieved availability for {DayCount} days in {Year}/{Month} for professional {ProfessionalId}",
                availability.Days.Count,
                query.Year,
                query.Month,
                query.ProfessionalId);

            return Result<MonthlyAvailabilityResponse>.Success(availability);
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Failed to get monthly availability for professional {ProfessionalId}",
                query.ProfessionalId);

            return Result<MonthlyAvailabilityResponse>.Failure(
                Error.Problem(
                    "Availability.GetMonthlyFailed",
                    "Failed to retrieve monthly availability"));
        }
    }
}