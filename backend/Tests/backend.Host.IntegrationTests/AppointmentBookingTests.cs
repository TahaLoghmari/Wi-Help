using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;

namespace backend.Host.IntegrationTests;

[Collection(nameof(HostIntegrationCollection))]
public sealed class AppointmentBookingTests(IntegrationTestWebApplicationFactory factory)
{
    [Fact]
    public async Task AuthenticatedPatient_CanBookAndHaveAppointmentAcceptedByAuthenticatedProfessional()
    {
        var actors = await AppointmentTestData.CreatePatientAndProfessionalAsync(factory);
        using var patientClient = factory.CreateClient();
        using var professionalClient = factory.CreateClient();

        patientClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer", await LoginAsync(patientClient, actors.Patient.Email, actors.Patient.Password));

        var startDate = DateTime.UtcNow.AddDays(30);
        var bookingResponse = await patientClient.PostAsJsonAsync("/appointments", new
        {
            ProfessionalId = actors.Professional.ProfileId,
            startDate,
            EndDate = startDate.AddMinutes(30),
            Price = 100m,
            Urgency = "Low",
            Notes = "Integration test appointment"
        });

        bookingResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        professionalClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer", await LoginAsync(professionalClient, actors.Professional.Email, actors.Professional.Password));

        var offeredAppointmentsResponse = await professionalClient.GetAsync("/appointments/professional/me?page=1&pageSize=10");

        offeredAppointmentsResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var offeredAppointments = await offeredAppointmentsResponse.Content.ReadFromJsonAsync<PagedResponse<AppointmentResponse>>();
        offeredAppointments.Should().NotBeNull();
        offeredAppointments!.Items.Should().ContainSingle();
        var appointment = offeredAppointments.Items.Single();
        appointment.ProfessionalId.Should().Be(actors.Professional.ProfileId);
        appointment.Status.Should().Be("Offered");

        var acceptanceResponse = await professionalClient.PostAsJsonAsync(
            $"/appointments/{appointment.Id}/respond", new { IsAccepted = true });

        acceptanceResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var confirmedAppointmentsResponse = await professionalClient.GetAsync("/appointments/professional/me?page=1&pageSize=10");

        confirmedAppointmentsResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var confirmedAppointments = await confirmedAppointmentsResponse.Content.ReadFromJsonAsync<PagedResponse<AppointmentResponse>>();
        confirmedAppointments.Should().NotBeNull();
        confirmedAppointments!.Items.Should().ContainSingle();
        confirmedAppointments.Items.Single().Status.Should().Be("Confirmed");
    }

    private static async Task<string> LoginAsync(HttpClient client, string email, string password)
    {
        var response = await client.PostAsJsonAsync("/auth/login", new { Email = email, Password = password });

        response.StatusCode.Should().Be(HttpStatusCode.OK, await response.Content.ReadAsStringAsync());
        var tokens = await response.Content.ReadFromJsonAsync<Tokens>();
        tokens.Should().NotBeNull();
        tokens!.AccessToken.Should().NotBeNullOrWhiteSpace();

        return tokens.AccessToken;
    }

    private sealed record Tokens(string AccessToken);

    private sealed record PagedResponse<T>(List<T> Items);

    private sealed record AppointmentResponse(Guid Id, Guid ProfessionalId, string Status);
}
