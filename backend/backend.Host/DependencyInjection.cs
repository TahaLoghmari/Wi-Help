using System.Net;
using System.Reflection;
using System.Text;
using System.Threading.RateLimiting;
using backend.Host.Extensions;
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
using Modules.Patients.Features;
using Modules.Patients.Infrastructure;
using Modules.Professionals.Features;
using Modules.Professionals.Infrastructure;

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
        
        builder.Services.AddControllers();

        return builder;
    }
    
    public static WebApplicationBuilder AddSwagger(this WebApplicationBuilder builder)
    {
        if (builder.Environment.IsDevelopment())
        {
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
                {
                    options.SwaggerDoc("v1", new OpenApiInfo
                    {
                        Title = "Wi Help",
                        Description = "An ASP.NET Core Web API for your application.",
                    });
                    options.CustomSchemaIds(t => t.FullName?.Replace("+", "."));
                }
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
                    },
                    OnChallenge = context =>
                    {
                        context.HandleResponse();
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        context.Response.ContentType = "application/problem+json";
                        
                        var problemDetails = new
                        {
                            type = "https://tools.ietf.org/html/rfc7235#section-3.1",
                            title = "Unauthorized",
                            status = StatusCodes.Status401Unauthorized,
                            detail = context.ErrorDescription ?? "You are not authorized to access this resource."
                        };
                        
                        return context.Response.WriteAsJsonAsync(problemDetails);
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
        
        Assembly[] moduleApplicationAssemblies = [
            AssemblyReference.Assembly,
            Modules.Identity.Features.AssemblyReference.Assembly,
            Modules.Patients.Features.AssemblyReference.Assembly,
            Modules.Professionals.Features.AssemblyReference.Assembly ];
        
        builder.Services.AddEndpoints(moduleApplicationAssemblies);
        
        builder.Services.AddIdentityInfrastructure(builder.Configuration);
        
        builder.Services.AddPatientsModule()
            .AddPatientsInfrastructure(builder.Configuration);
        
        builder.Services.AddProfessionalsModule()
            .AddProfessionalsInfrastructure(builder.Configuration);
        
        builder.Services.AddCommonModule(moduleApplicationAssemblies);
        
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

        GlobalJobFilters.Filters.Add(new AutomaticRetryAttribute { Attempts = 3 });

        return builder;
    }
}
