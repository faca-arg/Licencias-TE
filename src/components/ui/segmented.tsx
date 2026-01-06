import { cn } from "@/lib/utils"

type Option<T extends string> = { value: T; label: string }
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T
  onChange: (v: T) => void
  options: Option<T>[]
  className?: string
}) {
  return (
    <div className={cn("inline-flex rounded-xl border border-slate-200 bg-white p-1", className)}>
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "h-9 rounded-lg px-3 text-sm transition",
              active ? "bg-slate-900 text-white shadow-soft" : "text-slate-600 hover:bg-slate-50"
            )}
            type="button"
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
