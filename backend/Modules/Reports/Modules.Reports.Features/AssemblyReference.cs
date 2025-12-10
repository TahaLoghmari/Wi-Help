using System.Reflection;

namespace Modules.Reports.Features;

public static class AssemblyReference
{
    public static readonly Assembly Assembly = typeof(AssemblyReference).Assembly;
}
