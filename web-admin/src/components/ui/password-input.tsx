"use client";

import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const PasswordInput = forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  function PasswordInput({ className, ...props }, ref) {
    const [visible, setVisible] = useState(false);
    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn("pr-11", className)}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0.5 top-1/2 h-9 w-9 -translate-y-1/2 text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-200"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          aria-label={visible ? "Itago ang password" : "Ipakita ang password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
