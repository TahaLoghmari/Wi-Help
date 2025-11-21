using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Results;
using Modules.Patients.Domain;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Infrastructure.Database;
using Modules.Patients.PublicApi;
using Modules.Patients.PublicApi.Contracts;

namespace Modules.Patients.Features;

public class PatientModuleApi(
    PatientsDbContext dbContext,
    ILogger<PatientModuleApi> logger) : IPatientsModuleApi
{
    public async Task<Result> CreatePatientAsync(
        CreatePatientRequest request,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating patient for UserId: {UserId}", request.UserId);

        var existingPatient = await dbContext.Patients
            .FirstOrDefaultAsync(p => p.UserId == request.UserId, cancellationToken);
        
        if (existingPatient != null)
        {
            logger.LogWarning("Patient already exists for UserId: {UserId}", request.UserId);
            return Result.Failure(PatientErrors.AlreadyExists(request.UserId));
        }

        var patient = new Patient(request.UserId,request.EmergencyContact);
        
        dbContext.Patients.Add(patient);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Patient created successfully for UserId: {UserId}, PatientId: {PatientId}",
            request.UserId, patient.Id);

        return Result.Success();
    }

    public async Task<Result> UpdatePatientAsync(
        UpdatePatientRequest request,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating patient for UserId: {UserId}", request.UserId);

        var patient = await dbContext.Patients
            .FirstOrDefaultAsync(p => p.UserId == request.UserId, cancellationToken);
        
        if (patient is null)
        {
            logger.LogWarning("Patient not found for UserId: {UserId}", request.UserId);
            return Result.Failure(PatientErrors.NotFound(request.UserId));
        }

        patient.Update(request.EmergencyContact);
        
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Patient updated successfully for UserId: {UserId}, PatientId: {PatientId}",
            request.UserId, patient.Id);

        return Result.Success();
    }
}
