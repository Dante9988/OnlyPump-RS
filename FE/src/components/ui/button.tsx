import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 neon-glow",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-background/20 hover:bg-muted/20 hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 pink-glow",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-hero text-foreground hover:scale-105 neon-glow font-extrabold transition-bounce",
        cta: "bg-gradient-primary text-primary-foreground hover:shadow-neon font-bold border border-primary/20",
        accent: "bg-accent text-accent-foreground hover:bg-accent/80 green-glow",
        presale: "bg-gradient-accent text-foreground hover:scale-[1.02] font-bold shadow-elevation transition-bounce",
        // Token Management Button Variants
        "outline-orange": "border border-orange-500/20 bg-background/20 text-orange-500 hover:bg-orange-500/10 hover:text-orange-400",
        "outline-blue": "border border-blue-500/20 bg-background/20 text-blue-500 hover:bg-blue-500/10 hover:text-blue-400",
        "outline-purple": "border border-purple-500/20 bg-background/20 text-purple-500 hover:bg-purple-500/10 hover:text-purple-400",
        "outline-red": "border border-red-500/20 bg-background/20 text-red-500 hover:bg-red-500/10 hover:text-red-400",
        "outline-green": "border border-green-500/20 bg-background/20 text-green-500 hover:bg-green-500/10 hover:text-green-400",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-xl",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-16 rounded-xl px-12 text-lg font-extrabold",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
