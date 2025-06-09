
import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "accent";
  className?: string;
}

const LoadingSpinner = ({ size = "md", color = "primary", className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const colorClasses = {
    primary: "border-primary",
    secondary: "border-secondary",
    accent: "border-accent"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-transparent border-t-current",
          sizeClasses[size],
          colorClasses[color]
        )}
      />
    </div>
  );
};

export { LoadingSpinner };
