import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib';

export const alertIconMap = {
    default: AlertCircle,
    destructive: XCircle,
    success: CheckCircle,
    warning: AlertTriangle,
    info: Info,
} as const;

export type AlertVariant = keyof typeof alertIconMap;
// {React.createElement(alertIconMap['success'])}

const alertVariants = cva(
    'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
    {
        variants: {
            variant: {
                default: 'bg-card text-card-foreground',
                destructive: 'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
                success: 'bg-green-50 text-green-800 border-green-200 [&>svg]:text-green-600 *:data-[slot=alert-description]:text-green-700',
                warning: 'bg-yellow-50 text-yellow-800 border-yellow-200 [&>svg]:text-yellow-600 *:data-[slot=alert-description]:text-yellow-700',
                info: 'bg-blue-50 text-blue-800 border-blue-200 [&>svg]:text-blue-600 *:data-[slot=alert-description]:text-blue-700',
            },
            size: {
                sm: 'px-3 py-2 text-xs',
                default: 'px-4 py-3 text-sm',
                lg: 'px-5 py-4 text-base',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

type AlertProps = React.ComponentProps<'div'> & VariantProps<typeof alertVariants>;

function Alert({ className, variant, ...props }: AlertProps) {
    return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="alert-title" className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="alert-description"
            className={cn('text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed', className)}
            {...props}
        />
    );
}

export { Alert, AlertTitle, AlertDescription };
