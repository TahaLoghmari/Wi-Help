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
RecurringJob.AddOrUpdate<MessageStatusUpdateJob>(
    "mark-messages-delivered",
    job => job.MarkMessagesAsDeliveredForOnlineUsers(default),
    Cron.Minutely);

await app.RunAsync();