
import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  animated?: boolean;
  gradient?: boolean;
}

const ProgressBar = ({ 
  value, 
  max = 100, 
  className, 
  showLabel = false, 
  animated = true,
  gradient = false 
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out",
            gradient 
              ? "bg-gradient-to-r from-blue-500 to-purple-600" 
              : "bg-primary",
            animated && "transition-transform"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};

export { ProgressBar };
