import { Outlet, NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  ListTodo,
  Network,
  Route,
} from "lucide-react"

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/realms", label: "Reinos", icon: Sparkles },
  { to: "/missions", label: "Misiones", icon: ListTodo },
  { to: "/calendar", label: "Calendario", icon: CalendarDays },
  { to: "/blueprint", label: "Blueprint", icon: Network },
  { to: "/roadmap", label: "Roadmap", icon: Route },
]

export function AppShell() {
  return (
    <div className="min-h-screen bg-grid glow">
      <div className="mx-auto flex min-h-screen w-full max-w-[1800px] gap-4 p-4">
        <aside className="hidden w-[280px] shrink-0 lg:block">
          <div className="sticky top-4 rounded-3xl border border-emerald-500/10 bg-[#0c130f]/80 backdrop-blur p-5 shadow-soft">
            <div className="mb-6">
              <div className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                LIFE:180
              </div>
              <div className="mt-2 text-lg font-semibold text-white">Sistema de evolución humana</div>
              <div className="text-xs text-emerald-100/60">
                Seis reinos. Misiones diarias. Progreso visible.
              </div>
            </div>

            <nav className="space-y-1">
              {nav.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition",
                        isActive
                          ? "bg-emerald-400/15 text-emerald-100 shadow-soft"
                          : "text-emerald-100/70 hover:bg-emerald-500/10"
                      )
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                )
              })}
            </nav>

            <div className="mt-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
              <div className="text-xs text-emerald-100/70">Temporada actual</div>
              <div className="text-lg font-semibold text-white">S07 • Eclipse Verde</div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-emerald-950">
                <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-200" />
              </div>
              <div className="mt-2 text-xs text-emerald-100/60">62% completado</div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="sticky top-4 z-10 rounded-3xl border border-emerald-500/10 bg-[#0c130f]/80 backdrop-blur px-4 py-3 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">LIFE:180 Command Center</div>
                <div className="text-xs text-emerald-100/60">
                  Diseñado para entrar todos los días y sentir el progreso.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
                  Magic Link • Demo
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
