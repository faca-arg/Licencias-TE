import { cn } from "@/lib/utils"

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-slate-100",
        "before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] before:bg-[length:700px_100%] before:animate-shimmer",
        className
      )}
    />
  )
}
