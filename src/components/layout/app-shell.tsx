import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import logo from "@/assets/suizo-argentina.png"
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Home,
  Settings,
  LogOut,
} from "lucide-react"

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/home-office", label: "Home Office", icon: Home },
  { to: "/requests", label: "Solicitudes", icon: ClipboardList },
  { to: "/employees", label: "Empleados", icon: Users },
  { to: "/settings", label: "Configuración", icon: Settings },
]

export function AppShell() {
  const navigate = useNavigate()

  const onLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login", { replace: true })
  }

  return (
    <div className="min-h-screen bg-grid glow">
      <div className="mx-auto flex min-h-screen w-full max-w-[1800px] gap-4 p-4">
        <aside className="hidden w-[280px] shrink-0 lg:block">
          <div className="sticky top-4 rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur p-4 shadow-soft">
            <div className="mb-4">
              <div className="mb-3 flex items-center justify-center">
                <img
                  src={logo}
                  alt="Suizo Argentina"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div className="text-sm font-semibold text-slate-900">Licencias</div>
              <div className="text-xs text-slate-500">Vacaciones • Equipo</div>
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
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                        isActive
                          ? "bg-slate-900 text-white shadow-soft"
                          : "text-slate-700 hover:bg-slate-50"
                      )
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                )
              })}
            </nav>

            <div className="mt-6 border-t border-slate-200/70 pt-4">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="sticky top-4 z-10 rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur px-4 py-3 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">Panel</div>
                <div className="text-xs text-slate-500">
                  Control visual de vacaciones (timeline + mes)
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-xs text-slate-600">Empresa:</div>
                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
                  Suizo Argentina (demo)
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
