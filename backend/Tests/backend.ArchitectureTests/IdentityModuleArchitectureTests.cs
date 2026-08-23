using FluentAssertions;
using Modules.Common.Features.Abstractions;
using NetArchTest.Rules;

namespace backend.ArchitectureTests;

public sealed class IdentityModuleArchitectureTests
{
    [Fact]
    public void IdentityFeatureTypes_ShouldNotDependOn_Host()
    {
        var result = Types.InAssembly(Modules.Identity.Features.AssemblyReference.Assembly)
            .ShouldNot()
            .HaveDependencyOn("backend.Host")
            .GetResult();

        result.IsSuccessful.Should().BeTrue(string.Join(", ", result.FailingTypeNames ?? []));
    }

    [Fact]
    public void IdentityEndpoints_ShouldImplement_IEndpoint()
    {
        var endpointTypes = Types.InAssembly(Modules.Identity.Features.AssemblyReference.Assembly)
            .That()
            .ImplementInterface(typeof(IEndpoint))
            .GetTypes();

        endpointTypes.Should().NotBeEmpty();
    }
}
