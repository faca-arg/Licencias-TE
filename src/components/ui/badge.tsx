import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-emerald-500/20 bg-emerald-500/10 text-emerald-100",
        approved: "border-emerald-400/30 bg-emerald-400/15 text-emerald-100",
        pending: "border-lime-300/30 bg-lime-300/10 text-lime-100",
        homeoffice: "border-slate-400/30 bg-slate-400/10 text-slate-100",
        danger: "border-rose-400/40 bg-rose-500/10 text-rose-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
