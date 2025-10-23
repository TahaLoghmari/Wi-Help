using backend.Host;
using backend.Host.Extensions;
using Hangfire;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Serilog;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
builder
    .AddApi()
    .AddAuthentication()
    .AddErrorHandling()
    .AddServices()
    .AddLogging()
    .AddSwagger()
    .AddRateLimiting()
    .AddCaching()
    .AddHangfire();

builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));


WebApplication app = builder.Build();
if ( app.Environment.IsDevelopment() )
{
    app.UseSwagger();
    app.UseSwaggerUI();
    await app.ApplyMigrationsAsync();
}

// Liveness probe - just confirms the app is running
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false,
    ResultStatusCodes =
    {
        [HealthStatus.Healthy] = StatusCodes.Status200OK
    }
});

// Readiness probe - checks all dependencies tagged with "ready"
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = healthCheck => healthCheck.Tags.Contains("ready"),
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
    ResultStatusCodes =
    {
        [HealthStatus.Healthy] = StatusCodes.Status200OK,
        [HealthStatus.Degraded] = StatusCodes.Status200OK,
        [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable
    }
});

app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

app.UseHangfireDashboard();

app.UseExceptionHandler();
app.UseSerilogRequestLogging();
app.UseRateLimiter();


await app.RunAsync();
