namespace backend.Host.IntegrationTests;

[CollectionDefinition(nameof(HostIntegrationCollection), DisableParallelization = true)]
public sealed class HostIntegrationCollection : ICollectionFixture<IntegrationTestWebApplicationFactory>;
