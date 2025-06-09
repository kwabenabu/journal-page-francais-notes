
import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FloatingActionButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "accent";
}

const FloatingActionButton = ({
  icon: Icon,
  onClick,
  className,
  position = "bottom-right",
  size = "md",
  color = "primary"
}: FloatingActionButtonProps) => {
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6", 
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6"
  };

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-14 h-14",
    lg: "w-16 h-16"
  };

  const colorClasses = {
    primary: "bg-primary hover:bg-primary/90 text-primary-foreground",
    secondary: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
    accent: "bg-accent hover:bg-accent/90 text-accent-foreground"
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed z-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center",
        positionClasses[position],
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};

export { FloatingActionButton };
