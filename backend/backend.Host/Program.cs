using backend.Host;
using backend.Host.Extensions;
using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Modules.Identity.Infrastructure.Database;
using Modules.Patients.Infrastructure.Database;
using Modules.Professionals.Infrastructure.Database;
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
}

using (var scope = app.Services.CreateScope())
{
    var identityDbContext = scope.ServiceProvider.GetRequiredService<IdentityDbContext>();
    await identityDbContext.Database.MigrateAsync();
    
    var patientsDbContext = scope.ServiceProvider.GetRequiredService<PatientsDbContext>();
    await patientsDbContext.Database.MigrateAsync();
    
    var professionalsDbContext = scope.ServiceProvider.GetRequiredService<ProfessionalsDbContext>();
    await professionalsDbContext.Database.MigrateAsync();
    
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
    await IdentityDataSeeder.SeedRolesAsync(roleManager);
}


app.MapHealthCheckEndpoints();

app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

app.UseHangfireDashboard();
app.MapEndpoints();

app.UseExceptionHandler();
app.UseSerilogRequestLogging();
app.UseRateLimiter();
app.MapControllers();


await app.RunAsync();
