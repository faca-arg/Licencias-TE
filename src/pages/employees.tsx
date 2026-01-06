import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/AuthContext"

type EmployeeRow = {
  id: string
  legajo: string
  first_name: string
  last_name: string
  position: string
  area: string
  start_date: string
  active: boolean
  pending_current: number
  pending_previous: number
}

type FormState = {
  id?: string
  legajo: string
  first_name: string
  last_name: string
  position: string
  area: string
  start_date: string
  pending_current: number
  pending_previous: number
  active: boolean
}

const emptyForm = (): FormState => ({
  legajo: "",
  first_name: "",
  last_name: "",
  position: "",
  area: "",
  start_date: new Date().toISOString().slice(0, 10),
  pending_current: 14,
  pending_previous: 0,
  active: true,
})

export function EmployeesPage() {
  const { profile, loading: authLoading } = useAuth()
  const isAdmin = profile?.role === "admin"

  const [q, setQ] = useState("")
  const [rows, setRows] = useState<EmployeeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm())

  async function load() {
    setLoading(true)
    setErr(null)
    const { data, error } = await supabase
      .from("employees")
      .select("id, legajo, first_name, last_name, position, area, start_date, active, pending_current, pending_previous")
      .order("last_name", { ascending: true })

    if (error) {
      setErr(error.message)
      setRows([])
    } else {
      setRows((data || []) as any)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!authLoading) load()
  }, [authLoading])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return rows
    return rows.filter((e) =>
      `${e.first_name} ${e.last_name} ${e.legajo} ${e.area} ${e.position}`
        .toLowerCase()
        .includes(s)
    )
  }, [q, rows])

  const openNew = () => {
    setForm(emptyForm())
    setOpen(true)
  }

  const openEdit = (e: EmployeeRow) => {
    setForm({
      id: e.id,
      legajo: e.legajo || "",
      first_name: e.first_name || "",
      last_name: e.last_name || "",
      position: e.position || "",
      area: e.area || "",
      start_date: e.start_date.slice(0, 10),
      pending_current: Number(e.pending_current ?? 0),
      pending_previous: Number(e.pending_previous ?? 0),
      active: !!e.active,
    })
    setOpen(true)
  }

  const save = async () => {
    setSaving(true)
    setErr(null)

    const payload = {
      legajo: form.legajo.trim(),
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      position: form.position.trim(),
      area: form.area.trim(),
      start_date: form.start_date,
      pending_current: Number(form.pending_current || 0),
      pending_previous: Number(form.pending_previous || 0),
      active: !!form.active,
    }

    const res = form.id
      ? await supabase.from("employees").update(payload).eq("id", form.id)
      : await supabase.from("employees").insert(payload)

    if (res.error) {
      setErr(res.error.message)
      setSaving(false)
      return
    }

    setOpen(false)
    setSaving(false)
    await load()
  }

  const deactivate = async (id: string) => {
    if (!confirm("¿Desactivar empleado? (no se borra, solo se marca como inactivo)")) return
    const { error } = await supabase.from("employees").update({ active: false }).eq("id", id)
    if (error) return setErr(error.message)
    await load()
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Empleados</CardTitle>
            <CardDescription>
              {isAdmin
                ? "Gestión completa de empleados."
                : "Listado de empleados."}
            </CardDescription>
          </div>

          {isAdmin && (
            <Button variant="secondary" onClick={openNew}>
              + Nuevo
            </Button>
          )}
        </CardHeader>

        <CardContent>
          <div className="mb-3 flex items-center gap-2">
            <Input
              placeholder="Buscar por nombre, legajo, área..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Button variant="outline" onClick={load} disabled={loading}>
              {loading ? "Cargando…" : "Actualizar"}
            </Button>
          </div>

          {err && <div className="mb-3 text-sm text-red-600">{err}</div>}

          <div className="overflow-auto rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left">Legajo</th>
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-left">Área</th>
                  <th className="px-4 py-3 text-left">Puesto</th>
                  <th className="px-4 py-3 text-left">Ingreso</th>
                  <th className="px-4 py-3 text-left">Activo</th>
                  <th className="px-4 py-3 text-left">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-6 text-slate-500" colSpan={7}>
                      Cargando…
                    </td>
                  </tr>
                ) : filtered.length ? (
                  filtered.map((e) => (
                    <tr key={e.id} className="border-t border-slate-200">
                      <td className="px-4 py-3">{e.legajo}</td>
                      <td className="px-4 py-3 font-medium">
                        {e.first_name} {e.last_name}
                      </td>
                      <td className="px-4 py-3">{e.area}</td>
                      <td className="px-4 py-3">{e.position}</td>
                      <td className="px-4 py-3">{e.start_date.slice(0, 10)}</td>
                      <td className="px-4 py-3">{e.active ? "Sí" : "No"}</td>
                      <td className="px-4 py-3">
                        {isAdmin && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => openEdit(e)}>
                              Editar
                            </Button>
                            {e.active && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deactivate(e.id)}
                              >
                                Desactivar
                              </Button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-6 text-slate-500" colSpan={7}>
                      Sin resultados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {open && isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>{form.id ? "Editar empleado" : "Nuevo empleado"}</CardTitle>
            <CardDescription>
              El admin puede editar días de vacaciones.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <Labeled label="Legajo">
                <Input
                  value={form.legajo}
                  onChange={(e) => setForm((p) => ({ ...p, legajo: e.target.value }))}
                />
              </Labeled>

              <Labeled label="Ingreso">
                <Input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
                />
              </Labeled>

              <Labeled label="Nombre">
                <Input
                  value={form.first_name}
                  onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
                />
              </Labeled>

              <Labeled label="Apellido">
                <Input
                  value={form.last_name}
                  onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
                />
              </Labeled>

              <Labeled label="Área">
                <Input
                  value={form.area}
                  onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
                />
              </Labeled>

              <Labeled label="Puesto">
                <Input
                  value={form.position}
                  onChange={(e) => setForm((p) => ({ ...p, position: e.target.value }))}
                />
              </Labeled>

              <Labeled label="Pendientes (año)">
                <Input
                  type="number"
                  value={form.pending_current}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, pending_current: Number(e.target.value) }))
                  }
                />
              </Labeled>

              <Labeled label="Pendientes (anteriores)">
                <Input
                  type="number"
                  value={form.pending_previous}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, pending_previous: Number(e.target.value) }))
                  }
                />
              </Labeled>
            </div>

            {err && <div className="mt-3 text-sm text-red-600">{err}</div>}

            <div className="mt-4 flex gap-2">
              <Button onClick={save} disabled={saving}>
                {saving ? "Guardando…" : "Guardar"}
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-slate-600">{label}</div>
      {children}
    </div>
  )
}
