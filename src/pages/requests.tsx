import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/AuthContext"

type EmployeeLite = { id: string; first_name: string; last_name: string; legajo: string; active: boolean; pending_current: number; pending_previous: number }

type ReqRow = {
  id: string
  employee_id: string
  start_date: string
  end_date: string
  requested_days: number
  status: string
  created_at: string
}

type HolidayRow = { date: string }

type NewReq = {
  employee_id: string
  start_date: string
  end_date: string
  requested_days: number
  comment: string
}

const todayISO = () => new Date().toISOString().slice(0, 10)

function parseISO(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}
function toISO(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}
function isWeekend(d: Date) {
  const day = d.getDay()
  return day === 0 || day === 6
}
function businessDaysInclusive(startISO: string, endISO: string, holidaySet: Set<string>) {
  let a = parseISO(startISO)
  let b = parseISO(endISO)
  if (a > b) [a, b] = [b, a]

  let count = 0
  const cur = new Date(a.getTime())
  while (cur <= b) {
    const iso = toISO(cur)
    if (!isWeekend(cur) && !holidaySet.has(iso)) count++
    cur.setDate(cur.getDate() + 1)
  }
  return count
}

export function RequestsPage() {
  const { profile, loading: authLoading } = useAuth()
  const isAdmin = profile?.role === "admin"
  const myEmployeeId = profile?.employee_id || null

  const [employees, setEmployees] = useState<EmployeeLite[]>([])
  const [rows, setRows] = useState<ReqRow[]>([])
  const [holidaySet, setHolidaySet] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<NewReq>({
    employee_id: "",
    start_date: todayISO(),
    end_date: todayISO(),
    requested_days: 1,
    comment: "",
  })

  const empName = useMemo(() => {
    const m = new Map<string, string>()
    for (const e of employees) m.set(e.id, `${e.first_name} ${e.last_name}`)
    return m
  }, [employees])

  const selectedEmployee = useMemo(() => {
    const id = isAdmin ? form.employee_id : myEmployeeId
    return employees.find((e) => e.id === id) || null
  }, [employees, form.employee_id, isAdmin, myEmployeeId])

  const saldoPrev = selectedEmployee?.pending_previous ?? 0
  const saldoCur = selectedEmployee?.pending_current ?? 0
  const saldoTotal = saldoPrev + saldoCur

  const computedDays = useMemo(() => {
    if (!form.start_date || !form.end_date) return 0
    return businessDaysInclusive(form.start_date, form.end_date, holidaySet)
  }, [form.start_date, form.end_date, holidaySet])

  const remainingIfCreate = Math.max(0, saldoTotal - computedDays)
  const enough = computedDays <= saldoTotal

  async function load() {
    setLoading(true)
    setErr(null)

    const [empRes, reqRes, holRes] = await Promise.all([
      supabase
        .from("employees")
        .select("id, first_name, last_name, legajo, active, pending_current, pending_previous")
        .order("last_name"),
      supabase
        .from("vacation_requests")
        .select("id, employee_id, start_date, end_date, requested_days, status, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("holidays")
        .select("date")
        .gte("date", "2026-01-01")
        .lte("date", "2026-12-31"),
    ])

    if (empRes.error) setErr(empRes.error.message)
    if (reqRes.error) setErr(reqRes.error.message)
    if (holRes.error) setErr(holRes.error.message)

    const emps = ((empRes.data || []) as any).filter((e: any) => e.active !== false)
    setEmployees(emps)

    setRows((reqRes.data || []) as any)

    const hs = new Set<string>()
    for (const h of (holRes.data || []) as HolidayRow[]) hs.add(String(h.date).slice(0, 10))
    setHolidaySet(hs)

    // si es employee, preseleccionamos su empleado
    if (!isAdmin && myEmployeeId) {
      setForm((p) => ({ ...p, employee_id: myEmployeeId }))
    } else if (isAdmin && !form.employee_id && emps[0]?.id) {
      setForm((p) => ({ ...p, employee_id: emps[0].id }))
    }

    setLoading(false)
  }

  useEffect(() => {
    if (!authLoading) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading])

  const openNew = () => {
    setForm((p) => ({
      ...p,
      employee_id: isAdmin ? (employees[0]?.id || "") : (myEmployeeId || ""),
      start_date: todayISO(),
      end_date: todayISO(),
      requested_days: 1,
      comment: "",
    }))
    setOpen(true)
  }

  // cuando cambian fechas, recalculamos requested_days automáticamente
  useEffect(() => {
    setForm((p) => ({ ...p, requested_days: computedDays || 0 }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computedDays])

  const create = async () => {
    const employeeId = isAdmin ? form.employee_id : myEmployeeId
    if (!employeeId) return setErr("No se pudo determinar el empleado.")

    if (computedDays <= 0) return setErr("El período elegido no tiene días hábiles.")
    if (!enough) return setErr(`No tenés saldo suficiente. Te quedan ${saldoTotal} y pedís ${computedDays}.`)

    setSaving(true)
    setErr(null)

    const { error } = await supabase.from("vacation_requests").insert({
      employee_id: employeeId,
      start_date: form.start_date,
      end_date: form.end_date,
      requested_days: computedDays, // usamos el calculado real
      status: "pending",
    })

    setSaving(false)
    if (error) return setErr(error.message)

    setOpen(false)
    await load()
  }

  const setStatus = async (id: string, status: "approved" | "rejected") => {
    // acá (por ahora) solo cambia estado.
    // en el próximo paso hacemos: si approved => descuenta saldo automáticamente.
    const { error } = await supabase.from("vacation_requests").update({ status }).eq("id", id)
    if (error) return setErr(error.message)
    await load()
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Solicitudes</CardTitle>
            <CardDescription>
              {isAdmin ? "Administración y aprobación." : "Creá y seguí tus solicitudes (días hábiles + feriados)."}
            </CardDescription>
          </div>
          <Button variant="secondary" onClick={openNew}>
            + Nueva solicitud
          </Button>
        </CardHeader>

        <CardContent>
          <div className="mb-3 flex items-center gap-2">
            <Button variant="outline" onClick={load} disabled={loading}>
              {loading ? "Cargando…" : "Actualizar"}
            </Button>
            {err ? <div className="text-sm text-red-600">{err}</div> : null}
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-sm text-slate-500">Cargando…</div>
            ) : rows.length ? (
              rows.map((r) => (
                <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold">{empName.get(r.employee_id) || r.employee_id}</div>
                      <div className="text-xs text-slate-500">
                        {String(r.start_date).slice(0, 10)} → {String(r.end_date).slice(0, 10)} • {r.requested_days} días
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={r.status === "approved" ? "approved" : r.status === "pending" ? "pending" : "default"}
                      >
                        {String(r.status).toUpperCase()}
                      </Badge>

                      {isAdmin && r.status === "pending" ? (
                        <>
                          <Button size="sm" onClick={() => setStatus(r.id, "approved")}>Aprobar</Button>
                          <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "rejected")}>Rechazar</Button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">No hay solicitudes.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {open ? (
        <Card>
          <CardHeader>
            <CardTitle>Nueva solicitud</CardTitle>
            <CardDescription>Se crea como PENDING. Se calculan días hábiles (excluye feriados).</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Saldos */}
            <div className="mb-4 grid gap-3 md:grid-cols-3">
              <Stat label="Saldo anterior" value={`${saldoPrev} días`} />
              <Stat label="Saldo año actual" value={`${saldoCur} días`} />
              <Stat label="Saldo total" value={`${saldoTotal} días`} />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {isAdmin && (
                <Field label="Empleado">
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={form.employee_id}
                    onChange={(e) => setForm((p) => ({ ...p, employee_id: e.target.value }))}
                  >
                    {employees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.last_name}, {e.first_name} ({e.legajo})
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              <Field label="Días que se tomaría (hábiles)">
                <Input type="number" value={computedDays} readOnly />
              </Field>

              <Field label="Desde">
                <Input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
                />
              </Field>

              <Field label="Hasta">
                <Input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))}
                />
              </Field>
            </div>

            {/* Preview */}
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-medium">
                    Te tomarías <span className="font-semibold">{computedDays}</span> días
                  </div>
                  <div className="text-slate-600">
                    Te quedarían <span className="font-semibold">{remainingIfCreate}</span> días (total)
                  </div>
                </div>
                {!enough ? (
                  <div className="text-red-600 font-medium">
                    No tenés saldo suficiente
                  </div>
                ) : (
                  <div className="text-emerald-700 font-medium">
                    OK
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={create} disabled={saving || !enough}>
                {saving ? "Creando…" : "Crear"}
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-slate-600">{label}</div>
      {children}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
    </div>
  )
}
