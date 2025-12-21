using backend.Host;
using backend.Host.Extensions;
using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Modules.Appointments.Infrastructure.Database;
using Modules.Identity.Domain.Entities;
using Modules.Identity.Infrastructure.Database;
using Modules.Notifications.Infrastructure;
using Modules.Messaging.Infrastructure;
using Modules.Notifications.Infrastructure.Database;
using Modules.Patients.Infrastructure.Database;
using Modules.Professionals.Infrastructure.Database;
using Modules.Messaging.Infrastructure.Database;
using Modules.Messaging.Infrastructure.Jobs;
using Modules.Reviews.Infrastructure.Database;
using Modules.Common.Infrastructure.Services;
using Serilog;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
builder
    .AddApi()
    .AddAuthentication()
    .AddServices()
    .AddErrorHandling()
    .AddLogging()
    .AddSwagger()
    .AddRateLimiting()
    .AddCaching()
    .AddHangfire()
    .AddJsonConfiguration();

builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));


WebApplication app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var identityDbContext = scope.ServiceProvider.GetRequiredService<IdentityDbContext>();
    await identityDbContext.Database.MigrateAsync();

    var appointmentsDbContext = scope.ServiceProvider.GetRequiredService<AppointmentsDbContext>();
    await appointmentsDbContext.Database.MigrateAsync();

    var patientsDbContext = scope.ServiceProvider.GetRequiredService<PatientsDbContext>();
    await patientsDbContext.Database.MigrateAsync();

    var professionalsDbContext = scope.ServiceProvider.GetRequiredService<ProfessionalsDbContext>();
    await professionalsDbContext.Database.MigrateAsync();

    var notificationsDbContext = scope.ServiceProvider.GetRequiredService<NotificationsDbContext>();
    await notificationsDbContext.Database.MigrateAsync();

    var messagingDbContext = scope.ServiceProvider.GetRequiredService<MessagingDbContext>();
    await messagingDbContext.Database.MigrateAsync();

    var reviewsDbContext = scope.ServiceProvider.GetRequiredService<ReviewsDbContext>();
    await reviewsDbContext.Database.MigrateAsync();

    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
    await IdentityDataSeeder.SeedRolesAsync(roleManager);

    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    await IdentityDataSeeder.SeedAdminUserAsync(userManager, configuration);

    // Seed professional users
    var professionalUserIds = await IdentityDataSeeder.SeedProfessionalUsersAsync(userManager);

    // Seed professionals
    var professionalsData = new List<(Guid UserId, string Specialization, int Experience)>
    {
        (professionalUserIds[0], "criticalCare", 11),
        (professionalUserIds[1], "criticalCare", 7)
    };
    var professionalIdsMap = await Modules.Professionals.Infrastructure.Database.ProfessionalDataSeeder.SeedProfessionalsAsync(professionalsDbContext, professionalsData);

    foreach (var (userId, professionalId) in professionalIdsMap)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user != null)
        {
            var claims = await userManager.GetClaimsAsync(user);
            if (!claims.Any(c => c.Type == "ProfessionalId"))
            {
                await userManager.AddClaimAsync(user, new System.Security.Claims.Claim("ProfessionalId", professionalId.ToString()));
            }
        }
    }

    // Seed patient users
    var patientUserIds = await IdentityDataSeeder.SeedPatientUsersAsync(userManager);

    // Seed patients
    var patientsData = new List<(Guid UserId, Modules.Patients.Domain.ValueObjects.EmergencyContact EmergencyContact)>
    {
        (patientUserIds[0], new Modules.Patients.Domain.ValueObjects.EmergencyContact("Sami Ben Youssef", "+216 98 442 109", "friend")),
        (patientUserIds[1], new Modules.Patients.Domain.ValueObjects.EmergencyContact("Yassine Karray", "+216 97 560 882", "friend"))
    };
    var patientIdsMap = await Modules.Patients.Infrastructure.Database.PatientDataSeeder.SeedPatientsAsync(patientsDbContext, patientsData);

    foreach (var (userId, patientId) in patientIdsMap)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user != null)
        {
            var claims = await userManager.GetClaimsAsync(user);
            if (!claims.Any(c => c.Type == "PatientId"))
            {
                await userManager.AddClaimAsync(user, new System.Security.Claims.Claim("PatientId", patientId.ToString()));
            }
        }
    }

    var supabaseService = scope.ServiceProvider.GetRequiredService<SupabaseService>();
    await supabaseService.InitializeAsync();
}

app.UseExceptionHandler();
app.UseSerilogRequestLogging();
app.UseRateLimiter();

app.MapHealthCheckEndpoints();

app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

app.UseHangfireDashboard();
app.MapEndpoints();
app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");
app.MapHub<ChatHub>("/hubs/chat");

// Schedule recurring jobs
try
{
    RecurringJob.AddOrUpdate<MessageStatusUpdateJob>(
        "mark-messages-delivered",
        job => job.MarkMessagesAsDeliveredForOnlineUsers(default),
        Cron.Minutely);
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "Failed to schedule recurring job 'mark-messages-delivered'");
}

await app.RunAsync();