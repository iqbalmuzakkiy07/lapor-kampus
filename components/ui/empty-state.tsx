import React from "react";
import { Inbox } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-dashed border-[#8EB69B]/60 bg-white/70">
      <div className="w-14 h-14 rounded-full bg-[#DAF1DE] flex items-center justify-center text-[#163832] mb-4">
        {icon || <Inbox className="w-7 h-7" />}
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-[#051F20] mb-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#526B61] max-w-sm mb-5">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

