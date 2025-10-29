using backend.Host;
using backend.Host.Extensions;
using Hangfire;
using Microsoft.AspNetCore.Identity;
using Modules.Identity.Infrastructure.Database;
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

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    await IdentityDataSeeder.SeedRolesAsync(roleManager);
}

if ( app.Environment.IsDevelopment() )
{
    app.UseSwagger();
    app.UseSwaggerUI();
    await app.ApplyMigrationsAsync();
}

app.MapHealthCheckEndpoints();

app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

app.UseHangfireDashboard();

app.UseExceptionHandler();
app.UseSerilogRequestLogging();
app.UseRateLimiter();
app.MapEndpoints();


await app.RunAsync();
