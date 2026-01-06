import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/AuthContext"

type ProfileRow = {
  id: string
  email: string
  full_name?: string | null
  role: "admin" | "employee"
}

type HolidayRow = {
  id: string
  date: string
  name: string
  kind: string
}

export function SettingsPage() {
  const { profile } = useAuth()
  const isAdmin = profile?.role === "admin"

  const [profiles, setProfiles] = useState<ProfileRow[]>([])
  const [holidays, setHolidays] = useState<HolidayRow[]>([])
  const [err, setErr] = useState<string | null>(null)

  const [newHoliday, setNewHoliday] = useState({
    date: "",
    name: "",
  })

  /* =======================
     LOAD DATA
  ======================= */
  useEffect(() => {
    if (!isAdmin) return
    loadProfiles()
    loadHolidays()
  }, [isAdmin])

  async function loadProfiles() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role")
      .order("email")

    if (error) return setErr(error.message)

    setProfiles((data || []) as any)
  }

  async function loadHolidays() {
    const { data, error } = await supabase
      .from("holidays")
      .select("id, date, name, kind")
      .order("date")

    if (error) return setErr(error.message)
    setHolidays((data || []) as any)
  }

  /* =======================
     ACTIONS
  ======================= */
  async function updateRole(id: string, role: "admin" | "employee") {
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", id)

    if (error) return setErr(error.message)
    await loadProfiles()
  }

  async function addHoliday() {
    if (!newHoliday.date || !newHoliday.name) return

    const { error } = await supabase.from("holidays").insert({
      date: newHoliday.date,
      name: newHoliday.name,
      kind: "custom",
    })

    if (error) return setErr(error.message)

    setNewHoliday({ date: "", name: "" })
    await loadHolidays()
  }

  async function removeHoliday(id: string) {
    if (!confirm("¿Eliminar feriado?")) return
    const { error } = await supabase.from("holidays").delete().eq("id", id)
    if (error) return setErr(error.message)
    await loadHolidays()
  }

  /* =======================
     RENDER
  ======================= */
  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
          <CardDescription>No tenés permisos para ver esta sección.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {err && <div className="text-sm text-red-600">{err}</div>}

      {/* ================= ROLES ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Roles de usuarios</CardTitle>
          <CardDescription>Administrá permisos de acceso.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {profiles.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border px-4 py-2"
              >
                <div className="text-sm">
                  <div className="font-medium">{p.email || "—"}</div>
                  {p.full_name ? (
                    <div className="text-xs text-slate-500">{p.full_name}</div>
                  ) : null}
                </div>

                <select
                  className="rounded-lg border px-2 py-1 text-sm"
                  value={p.role}
                  onChange={(e) =>
                    updateRole(p.id, e.target.value as "admin" | "employee")
                  }
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            ))}
          </div>
        </CardContent>

      </Card>

      {/* ================= HOLIDAYS ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Feriados</CardTitle>
          <CardDescription>
            Se usan para pintar el calendario y calcular días.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Input
              type="date"
              value={newHoliday.date}
              onChange={(e) =>
                setNewHoliday((p) => ({ ...p, date: e.target.value }))
              }
            />
            <Input
              placeholder="Nombre del feriado"
              value={newHoliday.name}
              onChange={(e) =>
                setNewHoliday((p) => ({ ...p, name: e.target.value }))
              }
            />
            <Button onClick={addHoliday}>Agregar</Button>
          </div>

          <div className="space-y-2">
            {holidays.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between rounded-xl border px-4 py-2 text-sm"
              >
                <div>
                  <span className="font-medium">{h.date}</span> — {h.name}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeHoliday(h.id)}
                >
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
