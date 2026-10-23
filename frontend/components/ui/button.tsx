import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-sm hover:bg-blue-500 shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/25",
        destructive:
          "bg-rose-600 text-white shadow-sm hover:bg-rose-500 shadow-rose-500/20",
        outline:
          "border border-slate-200 dark:border-zinc-800 bg-transparent text-slate-800 dark:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800/80 shadow-xs",
        secondary:
          "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 hover:bg-slate-200 dark:hover:bg-zinc-700/80",
        ghost:
          "text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/80",
        link: "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline p-0 h-auto font-medium",
        success:
          "bg-emerald-600 text-white shadow-sm hover:bg-emerald-500 shadow-emerald-500/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base font-bold",
        icon: "h-9 w-9 p-0 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
