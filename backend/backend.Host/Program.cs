using backend.Host;
using backend.Host.Extensions;
using backend.Host.Authentication;
using Modules.Identity.Features.Auth;
using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Modules.Identity.Infrastructure.Database;
using Modules.Notifications.Infrastructure;
using Modules.Messaging.Infrastructure;
using Modules.Messaging.Infrastructure.Jobs;
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


builder.Services.AddScoped<IAuthCookies, CookieService>();

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

await app.ApplyMigrationsAsync();

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
    await IdentityDataSeeder.SeedRolesAsync(roleManager);

    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    await IdentityDataSeeder.SeedAdminUserAsync(userManager, configuration);

    if (!app.Environment.IsEnvironment("Testing"))
    {
        var supabaseService = scope.ServiceProvider.GetRequiredService<SupabaseService>();
        await supabaseService.InitializeAsync();
    }
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

public partial class Program;
