using System.Reflection;

namespace Modules.Professionals.Features;

public static class AssemblyReference
{
    public static readonly Assembly Assembly = typeof(AssemblyReference).Assembly;
}
