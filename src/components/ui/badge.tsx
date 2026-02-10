import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 text-white shadow-sm shadow-emerald-500/20 [a&]:hover:shadow-md",
        secondary:
          "bg-gradient-to-r from-amber-500/15 to-yellow-500/15 dark:from-amber-400/15 dark:to-yellow-400/15 text-amber-700 dark:text-amber-300 border-amber-400/20 [a&]:hover:from-amber-500/25 [a&]:hover:to-yellow-500/25",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-border/60 bg-background/50 backdrop-blur-sm text-foreground shadow-sm [a&]:hover:bg-accent/10 [a&]:hover:text-accent-foreground [a&]:hover:border-emerald-500/30",
        ghost: "bg-emerald-500/5 dark:bg-emerald-400/5 [a&]:hover:bg-emerald-500/10 [a&]:hover:text-emerald-700 dark:[a&]:hover:text-emerald-300",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
