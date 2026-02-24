"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

type StrengthLevel = "very-weak" | "weak" | "fair" | "good" | "strong";

const strengthConfig: Record<
  StrengthLevel,
  { label: string; color: string; segments: number }
> = {
  "very-weak": { label: "Very weak", color: "bg-red-500", segments: 1 },
  weak: { label: "Weak", color: "bg-orange-500", segments: 2 },
  fair: { label: "Fair", color: "bg-yellow-500", segments: 3 },
  good: { label: "Good", color: "bg-lime-500", segments: 4 },
  strong: { label: "Strong", color: "bg-green-500", segments: 5 },
};

function calculateStrength(password: string): StrengthLevel {
  if (!password) return "very-weak";

  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  // score: 0-1 = very-weak, 2 = weak, 3 = fair, 4 = good, 5-6 = strong
  if (score <= 1) return "very-weak";
  if (score === 2) return "weak";
  if (score === 3) return "fair";
  if (score === 4) return "good";
  return "strong";
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => calculateStrength(password), [password]);
  const config = strengthConfig[strength];

  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < config.segments ? config.color : "bg-muted"
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Password strength:{" "}
        <span className="font-medium">{config.label}</span>
      </p>
    </div>
  );
}
