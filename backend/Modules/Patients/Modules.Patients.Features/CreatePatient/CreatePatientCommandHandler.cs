using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Results;
using Modules.Common.Features.ValueObjects;
using Modules.Patients.Domain.Entities;
using Modules.Patients.Domain;
using Modules.Patients.Domain.ValueObjects;
using Modules.Patients.Infrastructure;

namespace Modules.Patients.Features.CreatePatient;

public sealed class CreatePatientCommandHandler(
    PatientDbContext dbContext,
    ILogger<CreatePatientCommandHandler> logger) : ICommandHandler<CreatePatientCommand>
{
    public async Task<Result> Handle(
        CreatePatientCommand command,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating patient for UserId: {UserId}", command.UserId);

        var existingPatient = await dbContext.Patients
            .FirstOrDefaultAsync(p => p.UserId == command.UserId, cancellationToken);
        
        if (existingPatient != null)
        {
            logger.LogWarning("Patient already exists for UserId: {UserId}", command.UserId);
            return Result.Failure(PatientErrors.AlreadyExists(command.UserId));
        }

        var address = new Address(
            command.Street,
            command.City,
            command.PostalCode,
            command.Country,
            command.Latitude,
            command.Longitude);
        
        var emergencyContact = new EmergencyContact(
            command.EmergencyFullName,
            command.EmergencyPhoneNumber,
            command.EmergencyRelationship
        );

        var patient = Patient.Create(command.UserId, address,emergencyContact);
        
        dbContext.Patients.Add(patient);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Patient created successfully for UserId: {UserId}, PatientId: {PatientId}",
            command.UserId, patient.Id);

        return Result.Success();
    }


}
