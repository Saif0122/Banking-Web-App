import React from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password?: string;
  className?: string;
}

export function PasswordStrengthMeter({ password = "", className }: PasswordStrengthMeterProps) {
  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (!pwd) return score;
    if (pwd.length > 8) score += 1;
    if (pwd.length > 12) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return Math.min(score, 5);
  };

  const strength = calculateStrength(password);

  const getStrengthLabel = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return "Weak";
      case 2:
      case 3:
        return "Fair";
      case 4:
        return "Good";
      case 5:
        return "Strong";
      default:
        return "";
    }
  };

  const getStrengthColor = (score: number, index: number) => {
    if (index >= score) return "bg-muted";
    if (score <= 1) return "bg-destructive";
    if (score <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center text-xs font-medium">
        <span className="text-muted-foreground">Password strength</span>
        <span
          className={cn(
            "transition-colors",
            strength <= 1 ? "text-destructive" : strength <= 3 ? "text-yellow-600 dark:text-yellow-500" : "text-green-600 dark:text-green-500"
          )}
        >
          {password ? getStrengthLabel(strength) : ""}
        </span>
      </div>
      <div className="flex gap-1 h-1.5">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={cn(
              "h-full flex-1 rounded-full transition-all duration-300",
              getStrengthColor(strength, index)
            )}
          />
        ))}
      </div>
    </div>
  );
}
