import { cva, type VariantProps } from "class-variance-authority";

/** Server-safe — use on Link elements in RSC pages. */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_24px_rgba(56,189,248,0.35)] hover:shadow-[0_0_32px_rgba(56,189,248,0.5)]",
        secondary: "glass-panel text-slate-200 hover:border-cyan-500/40",
        outline: "border border-cyan-500/30 bg-transparent text-cyan-100 hover:bg-cyan-500/10",
        ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
        destructive: "bg-red-600/90 text-white hover:bg-red-500",
        gov: "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-white shadow-[0_0_28px_rgba(56,189,248,0.4)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
