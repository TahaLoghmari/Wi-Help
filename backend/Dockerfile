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
COPY Modules/Carriers/Modules.Carriers.Domain/Modules.Carriers.Domain.csproj ./Modules/Carriers/Modules.Carriers.Domain/
COPY Modules/Carriers/Modules.Carriers.Features/Modules.Carriers.Features.csproj ./Modules/Carriers/Modules.Carriers.Features/
COPY Modules/Carriers/Modules.Carriers.Infrastructure/Modules.Carriers.Infrastructure.csproj ./Modules/Carriers/Modules.Carriers.Infrastructure/
COPY Modules/Carriers/Modules.Carriers.PublicApi/Modules.Carriers.PublicApi.csproj ./Modules/Carriers/Modules.Carriers.PublicApi/
COPY Modules/Shipments/Modules.Shipments.Domain/Modules.Shipments.Domain.csproj ./Modules/Shipments/Modules.Shipments.Domain/
COPY Modules/Shipments/Modules.Shipments.Features/Modules.Shipments.Features.csproj ./Modules/Shipments/Modules.Shipments.Features/
COPY Modules/Shipments/Modules.Shipments.Infrastructure/Modules.Shipments.Infrastructure.csproj ./Modules/Shipments/Modules.Shipments.Infrastructure/
COPY Modules/Stocks/Modules.Stocks.Domain/Modules.Stocks.Domain.csproj ./Modules/Stocks/Modules.Stocks.Domain/
COPY Modules/Stocks/Modules.Stocks.Features/Modules.Stocks.Features.csproj ./Modules/Stocks/Modules.Stocks.Features/
COPY Modules/Stocks/Modules.Stocks.Infrastructure/Modules.Stocks.Infrastructure.csproj ./Modules/Stocks/Modules.Stocks.Infrastructure/
COPY Modules/Stocks/Modules.Stocks.PublicApi/Modules.Stocks.PublicApi.csproj ./Modules/Stocks/Modules.Stocks.PublicApi/
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
