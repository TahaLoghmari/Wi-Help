/*using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Modules.Common.Features.Abstractions;

namespace Modules.Patients.Features.Appointments.Book;

public class BookAppointment : IEndpoint

{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("patients/appointments/book", async ()
                IQueryHandler<BookAppointmentQuery, BookAppointmentResponse> handler,
                CancellationToken cancellationToken) =>
            {
                var query = new BookAppointmentQuery();
                var result = await handler.Handle(query, cancellationToken);
                return Results.Ok(result);
            })
            .WithTags("Patients");
    }
}*/