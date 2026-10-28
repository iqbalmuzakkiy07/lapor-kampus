import React from "react";
import { ComplaintPriority, ComplaintStatus } from "@/types/database";
import {
  PRIORITY_LABELS,
  PRIORITY_STYLES,
  STATUS_LABELS,
  STATUS_STYLES,
  cn,
} from "@/lib/utils";

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  const label = STATUS_LABELS[status] || status;
  const style = STATUS_STYLES[status] || STATUS_STYLES.dikirim;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-pill border",
        style.bg,
        style.border,
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-xs sm:text-sm",
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", style.dot)} />
      <span className="font-semibold">{label}</span>
    </span>
  );
}

interface PriorityBadgeProps {
  priority: ComplaintPriority;
  size?: "sm" | "md";
  className?: string;
}

export function PriorityBadge({ priority, size = "md", className }: PriorityBadgeProps) {
  const label = PRIORITY_LABELS[priority] || priority;
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.sedang;

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-pill border uppercase tracking-wider",
        style,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs",
        className
      )}
    >
      {label}
    </span>
  );
}

