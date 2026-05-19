"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { usePerformanceMode } from "@/lib/use-performance-mode";
import { buttonVariants } from "@/components/ui/button-variants";

export type { ButtonVariantProps } from "@/components/ui/button-variants";
export { buttonVariants } from "@/components/ui/button-variants";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    const lite = usePerformanceMode();
    const btn = (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
    if (lite) {
      return <span className="inline-flex">{btn}</span>;
    }
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex">
        {btn}
      </motion.div>
    );
  }
);
Button.displayName = "Button";

export { Button };
