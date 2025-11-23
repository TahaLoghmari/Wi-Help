# syntax=docker/dockerfile:1

# Build arguments for flexibility
ARG DOTNET_VERSION=9.0
ARG BUILD_CONFIGURATION=Release

###################
# Build Stage
###################
FROM mcr.microsoft.com/dotnet/sdk:${DOTNET_VERSION} AS build
ARG BUILD_CONFIGURATION
WORKDIR /src

# Copy solution and project files first (better layer caching)
COPY backend.sln ./
COPY Directory.Build.props ./
COPY Directory.Packages.props ./

# Copy all project files to restore dependencies
COPY backend.Host/backend.Host.csproj ./backend.Host/
COPY Modules/Administration/Modules.Administration.Domain/Modules.Administration.Domain.csproj ./Modules/Administration/Modules.Administration.Domain/
COPY Modules/Administration/Modules.Administration.Features/Modules.Administration.Features.csproj ./Modules/Administration/Modules.Administration.Features/
COPY Modules/Administration/Modules.Administration.Infrastructure/Modules.Administration.Infrastructure.csproj ./Modules/Administration/Modules.Administration.Infrastructure/
COPY Modules/Administration/Modules.Administration.PublicApi/Modules.Administration.PublicApi.csproj ./Modules/Administration/Modules.Administration.PublicApi/
COPY Modules/Dispatch/Modules.Dispatch.Domain/Modules.Dispatch.Domain.csproj ./Modules/Dispatch/Modules.Dispatch.Domain/
COPY Modules/Dispatch/Modules.Dispatch.Features/Modules.Dispatch.Features.csproj ./Modules/Dispatch/Modules.Dispatch.Features/
COPY Modules/Dispatch/Modules.Dispatch.Infrastructure/Modules.Dispatch.Infrastructure.csproj ./Modules/Dispatch/Modules.Dispatch.Infrastructure/
COPY Modules/Dispatch/Modules.Dispatch.PublicApi/Modules.Dispatch.PublicApi.csproj ./Modules/Dispatch/Modules.Dispatch.PublicApi/
COPY Modules/Identity/Modules.Identity.Domain/Modules.Identity.Domain.csproj ./Modules/Identity/Modules.Identity.Domain/
COPY Modules/Identity/Modules.Identity.Features/Modules.Identity.Features.csproj ./Modules/Identity/Modules.Identity.Features/
COPY Modules/Identity/Modules.Identity.Infrastructure/Modules.Identity.Infrastructure.csproj ./Modules/Identity/Modules.Identity.Infrastructure/
COPY Modules/Identity/Modules.Identity.PublicApi/Modules.Identity.PublicApi.csproj ./Modules/Identity/Modules.Identity.PublicApi/
COPY Modules/Messaging/Modules.Messaging.Domain/Modules.Messaging.Domain.csproj ./Modules/Messaging/Modules.Messaging.Domain/
COPY Modules/Messaging/Modules.Messaging.Features/Modules.Messaging.Features.csproj ./Modules/Messaging/Modules.Messaging.Features/
COPY Modules/Messaging/Modules.Messaging.Infrastructure/Modules.Messaging.Infrastructure.csproj ./Modules/Messaging/Modules.Messaging.Infrastructure/
COPY Modules/Messaging/Modules.Messaging.PublicApi/Modules.Messaging.PublicApi.csproj ./Modules/Messaging/Modules.Messaging.PublicApi/
COPY Modules/Notifications/Modules.Notifications.Domain/Modules.Notifications.Domain.csproj ./Modules/Notifications/Modules.Notifications.Domain/
COPY Modules/Notifications/Modules.Notifications.Features/Modules.Notifications.Features.csproj ./Modules/Notifications/Modules.Notifications.Features/
COPY Modules/Notifications/Modules.Notifications.Infrastructure/Modules.Notifications.Infrastructure.csproj ./Modules/Notifications/Modules.Notifications.Infrastructure/
COPY Modules/Notifications/Modules.Notifications.PublicApi/Modules.Notifications.PublicApi.csproj ./Modules/Notifications/Modules.Notifications.PublicApi/
COPY Modules/Patients/Modules.Patients.Domain/Modules.Patients.Domain.csproj ./Modules/Patients/Modules.Patients.Domain/
COPY Modules/Patients/Modules.Patients.Features/Modules.Patients.Features.csproj ./Modules/Patients/Modules.Patients.Features/
COPY Modules/Patients/Modules.Patients.Infrastructure/Modules.Patients.Infrastructure.csproj ./Modules/Patients/Modules.Patients.Infrastructure/
COPY Modules/Patients/Modules.Patients.PublicApi/Modules.Patients.PublicApi.csproj ./Modules/Patients/Modules.Patients.PublicApi/
COPY Modules/Payments/Modules.Payments.Domain/Modules.Payments.Domain.csproj ./Modules/Payments/Modules.Payments.Domain/
COPY Modules/Payments/Modules.Payments.Features/Modules.Payments.Features.csproj ./Modules/Payments/Modules.Payments.Features/
COPY Modules/Payments/Modules.Payments.Infrastructure/Modules.Payments.Infrastructure.csproj ./Modules/Payments/Modules.Payments.Infrastructure/
COPY Modules/Payments/Modules.Payments.PublicApi/Modules.Payments.PublicApi.csproj ./Modules/Payments/Modules.Payments.PublicApi/
COPY Modules/Professionals/Modules.Professionals.Domain/Modules.Professionals.Domain.csproj ./Modules/Professionals/Modules.Professionals.Domain/
COPY Modules/Professionals/Modules.Professionals.Features/Modules.Professionals.Features.csproj ./Modules/Professionals/Modules.Professionals.Features/
COPY Modules/Professionals/Modules.Professionals.Infrastructure/Modules.Professionals.Infrastructure.csproj ./Modules/Professionals/Modules.Professionals.Infrastructure/
COPY Modules/Professionals/Modules.Professionals.PublicApi/Modules.Professionals.PublicApi.csproj ./Modules/Professionals/Modules.Professionals.PublicApi/
COPY Modules/Appointments/Modules.Appointments.Domain/Modules.Appointments.Domain.csproj ./Modules/Appointments/Modules.Appointments.Domain/
COPY Modules/Appointments/Modules.Appointments.Features/Modules.Appointments.Features.csproj ./Modules/Appointments/Modules.Appointments.Features/
COPY Modules/Appointments/Modules.Appointments.Infrastructure/Modules.Appointments.Infrastructure.csproj ./Modules/Appointments/Modules.Appointments.Infrastructure/
COPY Modules/Appointments/Modules.Appointments.PublicApi/Modules.Appointments.PublicApi.csproj ./Modules/Appointments/Modules.Appointments.PublicApi/
COPY Modules/Reviews/Modules.Reviews.Domain/Modules.Reviews.Domain.csproj ./Modules/Reviews/Modules.Reviews.Domain/
COPY Modules/Reviews/Modules.Reviews.Features/Modules.Reviews.Features.csproj ./Modules/Reviews/Modules.Reviews.Features/
COPY Modules/Reviews/Modules.Reviews.Infrastructure/Modules.Reviews.Infrastructure.csproj ./Modules/Reviews/Modules.Reviews.Infrastructure/
COPY Modules/Reviews/Modules.Reviews.PublicApi/Modules.Reviews.PublicApi.csproj ./Modules/Reviews/Modules.Reviews.PublicApi/
COPY Modules/Common/Modules.Common.Features/Modules.Common.Features.csproj ./Modules/Common/Modules.Common.Features/

# Restore dependencies
RUN dotnet restore "backend.sln"

# Copy the rest of the source code
COPY . .

# Build the application
WORKDIR /src/backend.Host
RUN dotnet build "backend.Host.csproj" \
    -c ${BUILD_CONFIGURATION} \
    -o /app/build

###################
# Publish Stage
###################
FROM build AS publish
ARG BUILD_CONFIGURATION
RUN dotnet publish "backend.Host.csproj" \
    -c ${BUILD_CONFIGURATION} \
    -o /app/publish \
    --no-restore \
    --no-build \
    /p:UseAppHost=false

###################
# Runtime Stage (Production)
###################
FROM mcr.microsoft.com/dotnet/aspnet:${DOTNET_VERSION} AS runtime
WORKDIR /app

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy published files
COPY --from=publish /app/publish .

# Set ownership
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose ports
EXPOSE 8080
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080 \
    DOTNET_RUNNING_IN_CONTAINER=true \
    ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "backend.Host.dll"]

###################
# Development Stage
###################
FROM mcr.microsoft.com/dotnet/sdk:${DOTNET_VERSION} AS development
WORKDIR /app

# Install wget for health checks
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY . .

# Restore dependencies
RUN dotnet restore "backend.sln"

# Build the application in Debug mode
RUN dotnet build "backend.sln" -c Debug

# Expose ports
EXPOSE 8080
EXPOSE 8081

# Set environment variables for development
ENV ASPNETCORE_URLS=http://+:8080 \
    DOTNET_RUNNING_IN_CONTAINER=true \
    ASPNETCORE_ENVIRONMENT=Development

WORKDIR /app/backend.Host

# Use the compiled DLL for debugging support
ENTRYPOINT ["dotnet", "bin/Debug/net9.0/backend.Host.dll"]

