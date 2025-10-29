using System.Reflection;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Modules.Common.Features.Abstractions;
using Modules.Common.Features.Decorators;

namespace Modules.Common.Features;

public static class DependencyInjection
{
    public static IServiceCollection AddCommonModule(
        this IServiceCollection services,
        Assembly[] moduleAssemblies)
    {
        foreach (var moduleAssembly in moduleAssemblies)
        {
            services.Scan(scan => scan
                .FromAssemblies(moduleAssembly)
                .AddClasses(classes => classes.AssignableTo(typeof(IQueryHandler<,>)), false)
                .AsImplementedInterfaces()
                .WithScopedLifetime()
                .AddClasses(classes => classes.AssignableTo(typeof(ICommandHandler<>)), false)
                .AsImplementedInterfaces()
                .WithScopedLifetime()
                .AddClasses(classes => classes.AssignableTo(typeof(ICommandHandler<,>)), false)
                .AsImplementedInterfaces()
                .WithScopedLifetime());
            services.AddValidatorsFromAssembly(moduleAssembly, includeInternalTypes: true);
        }

        services.Decorate(typeof(ICommandHandler<,>), typeof(ValidationDecorator.CommandHandler<,>));
        services.Decorate(typeof(ICommandHandler<>), typeof(ValidationDecorator.CommandBaseHandler<>));
        services.Decorate(typeof(IQueryHandler<,>), typeof(ValidationDecorator.QueryHandler<,>));

        services.Decorate(typeof(IQueryHandler<,>), typeof(LoggingDecorator.QueryHandler<,>));
        services.Decorate(typeof(ICommandHandler<,>), typeof(LoggingDecorator.CommandHandler<,>));
        services.Decorate(typeof(ICommandHandler<>), typeof(LoggingDecorator.CommandBaseHandler<>));

        return services;
    }
}
