import { cn } from "@/lib/utils";
import * as React from "react";

type Variant = "up" | "down" | "neutral" | "accent" | "gold";

const styles: Record<Variant, string> = {
  up: "bg-up/10 text-up border-up/20",
  down: "bg-down/10 text-down border-down/20",
  neutral: "bg-white/5 text-white/60 border-white/10",
  accent: "bg-accent/10 text-accent border-accent/20",
  gold: "bg-gold/10 text-gold border-gold/20",
};

export function Badge({
  variant = "neutral",
  className,
  ...props
}: { variant?: Variant } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
