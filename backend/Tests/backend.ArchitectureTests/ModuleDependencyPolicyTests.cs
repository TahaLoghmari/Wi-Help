using System.Xml.Linq;
using FluentAssertions;

namespace backend.ArchitectureTests;

public sealed class ModuleDependencyPolicyTests
{
    [Fact]
    public void ModuleProjectGraph_ShouldFollowDependencyPolicy()
    {
        var projects = LoadModuleProjects();
        var violations = projects.SelectMany(GetViolations).ToArray();

        violations.Should().BeEmpty(string.Join(Environment.NewLine, violations));
    }

    [Fact]
    public void Host_ShouldBeTheOnlyCompositionRoot()
    {
        var modulesDirectory = FindModulesDirectory();
        string hostProjectPath = Path.Combine(modulesDirectory, "..", "backend.Host", "backend.Host.csproj");
        var hostReferences = LoadProjectReferences(hostProjectPath);
        var violations = hostReferences
            .Select(GetProjectName)
            .Where(reference => reference.EndsWith(".Domain", StringComparison.Ordinal) ||
                                reference.EndsWith(".PublicApi", StringComparison.Ordinal))
            .Select(reference => $"backend.Host must compose Features and Infrastructure, not {reference}")
            .ToArray();

        violations.Should().BeEmpty(string.Join(Environment.NewLine, violations));
    }

    [Fact]
    public void Features_ShouldNotReferenceInfrastructureFrameworks()
    {
        var violations = Directory
            .EnumerateFiles(FindModulesDirectory(), "*.cs", SearchOption.AllDirectories)
            .Where(path => path.Contains(".Features", StringComparison.Ordinal))
            .SelectMany(path => new[]
            {
                "using Hangfire;",
                "using Microsoft.AspNetCore.SignalR;"
            }
            .Where(forbiddenUsing => File.ReadLines(path).Any(line => line.Trim() == forbiddenUsing))
            .Select(forbiddenUsing => $"{path} must not reference {forbiddenUsing[6..^1]}"))
            .ToArray();

        violations.Should().BeEmpty(string.Join(Environment.NewLine, violations));
    }

    [Fact]
    public void ModuleSourceNamespaces_ShouldFollowDependencyPolicy()
    {
        var violations = LoadModuleProjects()
            .SelectMany(GetNamespaceViolations)
            .ToArray();

        violations.Should().BeEmpty(string.Join(Environment.NewLine, violations));
    }

    private static IEnumerable<string> GetViolations(ModuleProject project)
    {
        foreach (string reference in project.References)
        {
            string referencedProject = GetProjectName(reference);
            if (!IsAllowedReference(project, referencedProject))
            {
                yield return $"{project.Name} must not reference {referencedProject}";
            }
        }

        foreach (string package in project.Packages.Where(package => !IsAllowedPackage(project, package)))
        {
            yield return $"{project.Name} must not reference package {package}";
        }
    }

    private static bool IsAllowedReference(ModuleProject project, string reference)
    {
        if (string.Equals(reference, "backend.Host", StringComparison.Ordinal))
        {
            return false;
        }

        if (string.Equals(project.Module, "Common", StringComparison.Ordinal))
        {
            return project.Layer == "Infrastructure" && reference == "Modules.Common.Features";
        }

        return project.Layer switch
        {
            "Domain" => reference == "Modules.Common.Features",
            "PublicApi" => reference == "Modules.Common.Features",
            "Infrastructure" => reference == "Modules.Common.Features" ||
                                reference == $"Modules.{project.Module}.Domain",
            "Features" => reference == "Modules.Common.Features" ||
                          reference == $"Modules.{project.Module}.Domain" ||
                          reference == $"Modules.{project.Module}.PublicApi" ||
                          reference.EndsWith(".PublicApi", StringComparison.Ordinal),
            _ => false
        };
    }

    private static bool IsAllowedPackage(ModuleProject project, string package)
    {
        if (project.Layer == "PublicApi")
        {
            return false;
        }

        if (project.Module != "Common" && project.Layer == "Features")
        {
            return package == "Microsoft.Extensions.DependencyInjection.Abstractions";
        }

        return true;
    }

    private static IEnumerable<string> GetNamespaceViolations(ModuleProject project)
    {
        string projectDirectory = Path.GetDirectoryName(project.Path)!;

        foreach (string sourceFile in Directory.EnumerateFiles(projectDirectory, "*.cs", SearchOption.AllDirectories))
        {
            foreach (string @namespace in GetUsingNamespaces(sourceFile))
            {
                if (!IsAllowedNamespace(project, @namespace))
                {
                    yield return $"{project.Name} must not use {@namespace} ({sourceFile})";
                }
            }
        }
    }

    private static IEnumerable<string> GetUsingNamespaces(string sourceFile) => File.ReadLines(sourceFile)
        .Select(line => line.Trim())
        .Where(line => line.StartsWith("using ", StringComparison.Ordinal) && line.EndsWith(';'))
        .Select(line => line[6..^1]);

    private static bool IsAllowedNamespace(ModuleProject project, string @namespace)
    {
        if (@namespace is "Microsoft.EntityFrameworkCore" or "Microsoft.AspNetCore.SignalR" or "Hangfire")
        {
            return project.Layer == "Infrastructure";
        }

        if (!@namespace.StartsWith("Modules.", StringComparison.Ordinal))
        {
            return true;
        }

        if (@namespace.StartsWith("Modules.Common.Features", StringComparison.Ordinal))
        {
            return true;
        }

        if (!TryGetModuleLayer(@namespace, out string module, out string layer))
        {
            return true;
        }

        if (module == project.Module && layer == project.Layer)
        {
            return true;
        }

        return project.Layer switch
        {
            "Domain" => false,
            "PublicApi" => false,
            "Infrastructure" => module == project.Module && layer == "Domain",
            "Features" => (module == project.Module && layer == "Domain") || layer == "PublicApi",
            _ => false
        };
    }

    private static bool TryGetModuleLayer(string @namespace, out string module, out string layer)
    {
        string[] parts = @namespace.Split('.');
        module = string.Empty;
        layer = string.Empty;

        if (parts.Length < 3 || parts[0] != "Modules")
        {
            return false;
        }

        module = parts[1];
        layer = parts[2];
        return layer is "Domain" or "Features" or "Infrastructure" or "PublicApi";
    }

    private static ModuleProject[] LoadModuleProjects() => Directory
        .EnumerateFiles(FindModulesDirectory(), "*.csproj", SearchOption.AllDirectories)
        .Select(path => new ModuleProject(
            path,
            GetProjectName(path),
            LoadProjectReferences(path),
            LoadPackageReferences(path)))
        .ToArray();

    private static string[] LoadProjectReferences(string projectPath) => XDocument.Load(projectPath)
        .Descendants("ProjectReference")
        .Select(reference => reference.Attribute("Include")?.Value ?? string.Empty)
        .Where(reference => !string.IsNullOrWhiteSpace(reference))
        .ToArray();

    private static string[] LoadPackageReferences(string projectPath) => XDocument.Load(projectPath)
        .Descendants("PackageReference")
        .Select(reference => reference.Attribute("Include")?.Value ?? string.Empty)
        .Where(reference => !string.IsNullOrWhiteSpace(reference))
        .ToArray();

    private static string GetProjectName(string path) => Path.GetFileNameWithoutExtension(path.Replace('\\', '/'));

    private static string FindModulesDirectory()
    {
        for (DirectoryInfo? directory = new(AppContext.BaseDirectory); directory is not null; directory = directory.Parent)
        {
            string modulesDirectory = Path.Combine(directory.FullName, "Modules");
            if (Directory.Exists(modulesDirectory))
            {
                return modulesDirectory;
            }
        }

        throw new DirectoryNotFoundException("Could not locate the backend Modules directory.");
    }

    private sealed record ModuleProject(
        string Path,
        string Name,
        string[] References,
        string[] Packages)
    {
        public string[] Parts { get; } = Name.Split('.');
        public string Module => Parts[1];
        public string Layer => Parts[2];
    }
}
