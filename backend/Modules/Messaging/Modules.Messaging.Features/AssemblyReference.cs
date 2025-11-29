using System.Reflection;

namespace Modules.Messaging.Features;

public static class AssemblyReference
{
    public static Assembly Assembly => typeof(AssemblyReference).Assembly;
}

