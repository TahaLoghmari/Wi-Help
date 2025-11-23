namespace Modules.Professionals.Infrastructure.DTOs;

public record ProfessionalsQueryParametersDto(
    string? Search = null,
    string? Location = null,
    decimal? MaxPrice = null,
    string? Availability = null
);
