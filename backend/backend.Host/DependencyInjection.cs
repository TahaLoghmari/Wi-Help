using System.Net;
using System.Reflection;
using System.Text;
using System.Threading.RateLimiting;
using backend.Host.Middlewares;
using FluentValidation;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Modules.Common.Features;
using Modules.Identity.Infrastructure;
using Serilog;
using Modules.Identity.Infrastructure.Settings;

namespace backend.Host;

internal static class DependencyInjection
{
    private static readonly string[] ReadyAndDbTags = new[] { "ready", "db" };

    public static WebApplicationBuilder AddApi(this WebApplicationBuilder builder)
    {
        builder.Services.ConfigureHttpJsonOptions(options =>
            options.SerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter()));
        
        string frontendUrl = builder.Configuration["FRONTEND_URL"]!;

        builder.Services.AddCors(options =>
            options.AddPolicy("AllowReactApp", policy =>
                   policy
                  .WithOrigins(frontendUrl)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials()
                )
        );
        
        return builder;
    }
    
    public static WebApplicationBuilder AddSwagger(this WebApplicationBuilder builder)
    {
        if (builder.Environment.IsDevelopment())
        {
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Wi Help",
                    Description = "An ASP.NET Core Web API for your application.",
                })
            ); 
        }
        
        return builder;
    }

    public static WebApplicationBuilder AddErrorHandling(this WebApplicationBuilder builder)
    {
        builder.Services.AddProblemDetails(options =>
            options.CustomizeProblemDetails = context =>
                context.ProblemDetails.Extensions.TryAdd("requestId", context.HttpContext.TraceIdentifier)
        );

        builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

        return builder;
    }
    
    public static WebApplicationBuilder AddAuthentication(this WebApplicationBuilder builder)
    {
        JwtSettings jwtAuthOptions = builder.Configuration.GetSection("Jwt").Get<JwtSettings>()!;

        builder.Services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            })
            .AddJwtBearer(options =>
            {
                IWebHostEnvironment env = builder.Environment;
                options.RequireHttpsMetadata = !env.IsDevelopment();
                options.SaveToken = true;
                
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwtAuthOptions.Issuer,

                    ValidateAudience = true,
                    ValidAudience = jwtAuthOptions.Audience,

                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtAuthOptions.Key)),

                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        if (context.Request.Cookies.ContainsKey("accessToken"))
                        {
                            context.Token = context.Request.Cookies["accessToken"];
                        }
                        return Task.CompletedTask;
                    }
                };
            })
            .AddGoogle(options =>
            {
                options.ClientId = builder.Configuration["Google:ClientId"]!;
                options.ClientSecret = builder.Configuration["Google:ClientSecret"]!;
            });

        builder.Services.AddAuthorization();
        builder.Services.AddHttpClient();

        return builder;
    }
    public static WebApplicationBuilder AddServices(this WebApplicationBuilder builder
    )
    {
        string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
        
        builder.Services.AddHealthChecks()
            .AddNpgSql(
                connectionString,
                name: "postgresql",
                healthQuery: "SELECT 1;",
                failureStatus: Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Unhealthy,
                tags: ReadyAndDbTags,
                timeout: TimeSpan.FromSeconds(5));
        
        var moduleAssemblies = Assembly.GetExecutingAssembly()
            .GetReferencedAssemblies()
            .Where(a => a.Name!.StartsWith("Modules."))
            .Select(Assembly.Load)
            .ToArray();
        
        builder.Services.AddCommonModule(moduleAssemblies);
        builder.Services.AddIdentityModule(builder.Configuration);
        return builder; 
    }
    public static WebApplicationBuilder AddLogging(this WebApplicationBuilder builder)
    {
        builder.Host.UseSerilog((context, configuration) =>
            configuration.ReadFrom.Configuration(context.Configuration));
        return builder;
    }
    public static WebApplicationBuilder AddRateLimiting(this WebApplicationBuilder builder)
    {
        builder.Services.AddRateLimiter(options =>
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, IPAddress>(context =>
            {
                IPAddress ipAddress = context.Connection.RemoteIpAddress!;
                return RateLimitPartition.GetFixedWindowLimiter(ipAddress,
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 100, 
                        Window = TimeSpan.FromMinutes(1), 
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 0
                    });
            })
        );

        return builder;
    }

    public static WebApplicationBuilder AddCaching(this WebApplicationBuilder builder)
    {
        builder.Services.AddMemoryCache();

        return builder;
    }

    public static WebApplicationBuilder AddHangfire(this WebApplicationBuilder builder)
    {
        builder.Services.AddHangfire(config =>
            config
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UsePostgreSqlStorage(options =>
                    options.UseNpgsqlConnection(
                        builder.Configuration.GetConnectionString("DefaultConnection"))));
        builder.Services.AddHangfireServer();
        
        // Configure Hangfire to use the same retry policy and filter
        GlobalJobFilters.Filters.Add(new AutomaticRetryAttribute { Attempts = 3 });

        return builder;
    }
}
