"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  const getStrength = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length > 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getStrength(password);

  const getColor = (index: number) => {
    if (strength === 0) return "bg-muted";
    if (strength <= 2) return index < strength ? "bg-destructive" : "bg-muted";
    if (strength === 3) return index < strength ? "bg-yellow-500" : "bg-muted";
    return index < strength ? "bg-emerald-500" : "bg-muted";
  };

  const getLabel = () => {
    if (strength === 0) return "Enter password";
    if (strength <= 2) return "Weak";
    if (strength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      <div className="flex gap-1 h-1.5 w-full">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className={`h-full w-full rounded-full transition-colors duration-300 ${getColor(
              index
            )}`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{getLabel()}</span>
    </div>
  );
}
