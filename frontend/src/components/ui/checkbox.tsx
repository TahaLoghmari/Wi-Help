import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
      props.onChange?.(e);
    };

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          className={cn("peer sr-only", className)}
          {...props}
        />
        <div
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-slate-300 bg-white shadow-xs transition-colors",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-slate-950 peer-focus-visible:ring-offset-2 peer-focus-visible:outline-none",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            checked && "border-brand-dark bg-brand-dark",
            className,
          )}
        >
          {checked && <Check className="h-3.5 w-3.5 text-white" />}
        </div>
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
