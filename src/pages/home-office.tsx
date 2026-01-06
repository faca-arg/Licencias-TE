import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/AuthContext"

type HomeOfficeRow = {
  id: string
  employee_id: string
  request_date: string
  week_start?: string | null
  status: "pending" | "approved" | "rejected" | "canceled"
  created_at: string
  employee?: {
    first_name: string
    last_name: string
    legajo: string
  } | null
}

function iso(d: Date) {
  return d.toISOString().slice(0, 10)
}

function startOfNextWeek(d = new Date()) {
  // ISO week: lunes = 1
  const day = d.getDay() // dom=0
  const deltaToMonday = ((day === 0 ? 7 : day) - 1)
  const thisMonday = new Date(d)
  thisMonday.setDate(d.getDate() - deltaToMonday)
  const nextMonday = new Date(thisMonday)
  nextMonday.setDate(thisMonday.getDate() + 7)
  nextMonday.setHours(0, 0, 0, 0)
  return nextMonday
}

function weekKeyFromISO(dateISO: string) {
  // simple key YYYY-WW (aprox) para validar "1 por semana" desde UI
  const d = new Date(dateISO + "T00:00:00")
  const thursday = new Date(d)
  thursday.setDate(d.getDate() + (4 - (d.getDay() || 7)))
  const yearStart = new Date(thursday.getFullYear(), 0, 1)
  const weekNo = Math.ceil((((thursday.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return `${thursday.getFullYear()}-${String(weekNo).padStart(2, "0")}`
}

function mondayOfISO(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00")
  const isoDow = d.getDay() === 0 ? 7 : d.getDay() // 1..7 (lun..dom)
  const m = new Date(d)
  m.setDate(d.getDate() - (isoDow - 1))
  return iso(m)
}

function addDaysISO(dateISO: string, days: number) {
  const d = new Date(dateISO + "T00:00:00")
  d.setDate(d.getDate() + days)
  return iso(d)
}

export function HomeOfficePage() {
  const { profile, user } = useAuth()
  const isAdmin = profile?.role === "admin"

  const [my, setMy] = useState<HomeOfficeRow[]>([])
  const [pending, setPending] = useState<HomeOfficeRow[]>([])
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const nextWeekDates = useMemo(() => {
    const start = startOfNextWeek(new Date())
    return Array.from({ length: 5 }).map((_, i) => {
      const x = new Date(start)
      x.setDate(start.getDate() + i)
      return iso(x)
    })
  }, [])

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, profile?.employee_id, user?.id])

  async function load() {
    setErr(null)
    if (!profile?.employee_id || !user?.id) {
      setMy([])
      setPending([])
      return
    }

    const myRes = await supabase
      .from("home_office_requests")
      .select("id, employee_id, request_date, week_start, status, created_at")
      .eq("user_id", user!.id)
      .order("request_date", { ascending: false })

    if (myRes.error) setErr(myRes.error.message)
    setMy((myRes.data || []) as any)

    if (isAdmin) {
      const pRes = await supabase
        .from("home_office_requests")
        .select("id, employee_id, request_date, week_start, status, created_at, employee:employees(first_name,last_name,legajo)")
        .eq("status", "pending")
        .order("created_at", { ascending: false })

      if (pRes.error) setErr(pRes.error.message)
      setPending((pRes.data || []) as any)
    } else {
      setPending([])
    }
  }

  const myNextWeek = useMemo(() => {
    const set = new Set(nextWeekDates)
    return my.filter((r) => set.has(String(r.request_date).slice(0, 10)))
  }, [my, nextWeekDates])

  const alreadyRequestedThisWeek = useMemo(() => {
    const nextWeekKey = nextWeekDates.length ? weekKeyFromISO(nextWeekDates[0]) : ""
    return my.some((r) => weekKeyFromISO(String(r.request_date).slice(0, 10)) === nextWeekKey)
  }, [my, nextWeekDates])

  async function createRequest() {
    if (!profile?.employee_id) {
      setErr("Tu usuario no está vinculado a un empleado (profiles.employee_id).")
      return
    }
    if (!selectedDate) return
    if (!nextWeekDates.includes(selectedDate)) {
      setErr("Solo podés solicitar Home Office para la semana próxima (lun-vie).")
      return
    }
    if (alreadyRequestedThisWeek) {
      setErr("Ya tenés un pedido de Home Office para la semana próxima.")
      return
    }

    setLoading(true)
    setErr(null)

    const { error } = await supabase.from("home_office_requests").insert({
      user_id: user!.id,
      // el trigger completa employee_id desde profiles.employee_id
      request_date: selectedDate,
      week_start: mondayOfISO(selectedDate),
      status: "pending",
    })

    setLoading(false)
    if (error) return setErr(error.message)

    setSelectedDate("")
    await load()
  }

  async function setStatus(id: string, status: "approved" | "rejected") {
    setLoading(true)
    setErr(null)
    const { error } = await supabase
      .from("home_office_requests")
      .update({ status })
      .eq("id", id)

    setLoading(false)
    if (error) return setErr(error.message)
    await load()
  }

  async function adminChangeDate(id: string, newDateISO: string, weekStartISO: string) {
    // Solo admin: permite mover el día dentro de la misma semana (lun-vie)
    setLoading(true)
    setErr(null)

    const { error } = await supabase
      .from("home_office_requests")
      .update({ request_date: newDateISO, week_start: weekStartISO })
      .eq("id", id)

    setLoading(false)
    if (error) return setErr(error.message)
    await load()
  }

  function statusBadge(status: HomeOfficeRow["status"]) {
    if (status === "approved") return <Badge variant="homeoffice">Aprobado</Badge>
    if (status === "pending") return <Badge variant="pending">Pendiente</Badge>
    if (status === "rejected") return <Badge variant="danger">Rechazado</Badge>
    return <Badge>—</Badge>
  }

  return (
    <div className="space-y-6">
      {err && <div className="text-sm text-red-600">{err}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Home Office</CardTitle>
          <CardDescription>
            Cada persona puede solicitar 1 día por semana (se carga con 1 semana de anticipación).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!profile?.employee_id ? (
            <div className="text-sm text-slate-600">
              Tu usuario no está vinculado a un empleado. Pedile a un admin que complete <span className="font-medium">profiles.employee_id</span>.
            </div>
          ) : (
            <>
              <div className="text-sm font-medium">Solicitar para la semana próxima</div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="rounded-lg border px-3 py-2 text-sm"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  disabled={loading || alreadyRequestedThisWeek}
                >
                  <option value="">Elegí un día (lun-vie)</option>
                  {nextWeekDates.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <Button onClick={createRequest} disabled={loading || !selectedDate || alreadyRequestedThisWeek}>
                  {alreadyRequestedThisWeek ? "Ya solicitado" : "Enviar solicitud"}
                </Button>
              </div>

              <div className="pt-2">
                <div className="text-sm font-medium">Mis solicitudes (semana próxima)</div>
                <div className="mt-2 space-y-2">
                  {myNextWeek.length === 0 ? (
                    <div className="text-sm text-slate-500">Sin solicitudes para la semana próxima.</div>
                  ) : (
                    myNextWeek.map((r) => (
                      <div key={r.id} className="flex items-center justify-between rounded-xl border px-4 py-2 text-sm">
                        <div>
                          <div className="font-medium">{String(r.request_date).slice(0, 10)}</div>
                          <div className="text-xs text-slate-500">Pedido: {String(r.created_at).slice(0, 10)}</div>
                        </div>
                        {statusBadge(r.status)}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Aprobaciones (Admin)</CardTitle>
            <CardDescription>Solicitudes pendientes de Home Office.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pending.length === 0 ? (
                <div className="text-sm text-slate-500">No hay pendientes.</div>
              ) : (
                pending.map((r) => (
                  <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-2 text-sm">
                    <div>
                      <div className="font-medium">
                        {(r.employee?.last_name || "Empleado") + ", " + (r.employee?.first_name || "")}
                        {r.employee?.legajo ? ` • Legajo ${r.employee.legajo}` : ""}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <div className="text-xs text-slate-500">Día:</div>
                        {(() => {
                          const current = String(r.request_date).slice(0, 10)
                          const weekStart = String(r.week_start || mondayOfISO(current)).slice(0, 10)
                          const options = Array.from({ length: 5 }).map((_, i) => addDaysISO(weekStart, i))
                          return (
                            <select
                              className="rounded-lg border px-2 py-1 text-xs"
                              value={current}
                              onChange={(e) => adminChangeDate(r.id, e.target.value, weekStart)}
                              disabled={loading}
                              title="Cambiar día (misma semana)"
                            >
                              {options.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>
                          )
                        })()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="pending">Pendiente</Badge>
                      <Button size="sm" onClick={() => setStatus(r.id, "approved")} disabled={loading}>
                        Aprobar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "rejected")} disabled={loading}>
                        Rechazar
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
