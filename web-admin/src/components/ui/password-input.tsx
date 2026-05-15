"use client";

import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const PasswordInput = forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  function PasswordInput({ className, ...props }, ref) {
    const [visible, setVisible] = useState(false);
    return (
      <div className="relative isolate">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn("password-input-field pr-12", className)}
          {...props}
        />
        <button
          type="button"
          className="absolute right-0 top-0 z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-r-xl text-slate-400 transition hover:bg-cyan-500/10 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          aria-label={visible ? "Itago ang password" : "Ipakita ang password"}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOff className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
          ) : (
            <Eye className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
