import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableProps,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex-row items-center justify-center rounded-full active:opacity-80",
  {
    variants: {
      variant: {
        default: "bg-brand-dark",
        outline: "border border-brand-dark bg-transparent",
        ghost: "bg-transparent",
        destructive: "bg-red-600",
      },
      size: {
        sm: "px-4 py-2",
        default: "px-6 py-3.5",
        lg: "px-8 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const textVariants = cva("font-semibold text-center", {
  variants: {
    variant: {
      default: "text-white",
      outline: "text-brand-dark",
      ghost: "text-brand-dark",
      destructive: "text-white",
    },
    size: {
      sm: "text-sm",
      default: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends PressableProps, VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
  textClassName?: string;
}

export function Button({
  children,
  variant,
  size,
  loading = false,
  className,
  textClassName,
  disabled,
  accessibilityLabel,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      className={cn(
        buttonVariants({ variant, size }),
        isDisabled && "opacity-60",
        className,
      )}
      disabled={isDisabled}
      accessibilityLabel={
        accessibilityLabel ??
        (typeof children === "string" ? children : undefined)
      }
      accessibilityRole="button"
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "outline" || variant === "ghost" ? "#00394a" : "#ffffff"
          }
          size="small"
        />
      ) : (
        <Text className={cn(textVariants({ variant, size }), textClassName)}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}
