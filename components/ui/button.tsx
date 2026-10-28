import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#235347] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99] select-none";

    const variants = {
      primary:
        "bg-[#163832] text-white hover:bg-[#235347] shadow-sm active:bg-[#0B2B26]",
      secondary:
        "bg-white border border-[#8EB69B] text-[#051F20] hover:bg-[#DAF1DE]/40 shadow-sm",
      outline:
        "border border-[#163832] text-[#163832] hover:bg-[#DAF1DE]/50",
      ghost:
        "text-[#163832] hover:bg-[#DAF1DE]/50",
      danger:
        "bg-[#B42318] text-white hover:bg-[#912018] shadow-sm",
    };

    const sizes = {
      sm: "h-9 px-3 text-xs rounded-sm",
      md: "min-h-[44px] px-4 py-2 text-sm",
      lg: "min-h-[48px] px-6 py-3 text-base",
      icon: "h-11 w-11 p-2",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };

