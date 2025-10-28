using Modules.Common.Features.Abstractions;

namespace Modules.Patients.Features.CreatePatient;

public sealed record CreatePatientCommand(
    Guid UserId,
    string Street,
    string City,
    string PostalCode,
    string Country,
    double Latitude,
    double Longitude,
    string EmergencyFullName,
    string EmergencyPhoneNumber,
    string EmergencyRelationship) : ICommand;
