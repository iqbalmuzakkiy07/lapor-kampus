import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  requiredMarker?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, label, error, helperText, requiredMarker, id, ...props },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#051F20]"
          >
            {label}
            {requiredMarker && <span className="ml-1 text-[#B42318]">*</span>}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            "flex min-h-[44px] w-full rounded-md border border-[#8EB69B] bg-white px-3 py-2 text-sm text-[#051F20] placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#235347] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[#B42318] focus-visible:ring-[#B42318]",
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && !error && (
          <p className="text-xs text-[#526B61]">{helperText}</p>
        )}
        {error && <p className="text-xs text-[#B42318] font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  requiredMarker?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, error, helperText, requiredMarker, id, ...props },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#051F20]"
          >
            {label}
            {requiredMarker && <span className="ml-1 text-[#B42318]">*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          className={cn(
            "flex min-h-[100px] w-full rounded-md border border-[#8EB69B] bg-white px-3 py-2 text-sm text-[#051F20] placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#235347] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[#B42318] focus-visible:ring-[#B42318]",
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && !error && (
          <p className="text-xs text-[#526B61]">{helperText}</p>
        )}
        {error && <p className="text-xs text-[#B42318] font-medium">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  requiredMarker?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error, helperText, requiredMarker, id, children, ...props },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#051F20]"
          >
            {label}
            {requiredMarker && <span className="ml-1 text-[#B42318]">*</span>}
          </label>
        )}
        <select
          id={inputId}
          className={cn(
            "flex min-h-[44px] w-full rounded-md border border-[#8EB69B] bg-white px-3 py-2 text-sm text-[#051F20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#235347] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[#B42318] focus-visible:ring-[#B42318]",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {helperText && !error && (
          <p className="text-xs text-[#526B61]">{helperText}</p>
        )}
        {error && <p className="text-xs text-[#B42318] font-medium">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Input, Textarea, Select };

