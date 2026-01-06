import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Plane, Clock, CalendarDays, Home } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  daysWindow,
  fmtFullLong,
  fmtMonthYear,
  clampMinDate,
  MIN_DATE,
} from "@/lib/dates"
import { Timeline } from "@/components/timeline/timeline"

/* =======================
   Types
======================= */
type EmployeeRow = {
  id: string
  first_name: string
  last_name: string
  legajo: string
  position: string
  area: string
  start_date: string
  active: boolean

  // ✅ NUEVO: traer saldo real
  pending_current: number
  pending_previous: number
}

type ReqRow = {
  id: string
  employee_id: string
  start_date: string
  end_date: string
  requested_days: number
  status: string
  created_at: string
}

type HolidayRow = {
  date: string
  name: string
}

type HomeOfficeRow = {
  id: string
  employee_id: string
  date: string
  status: string
  created_at: string
}

/* =======================
   Dashboard
======================= */
export function DashboardPage() {
  // Centro del timeline (mínimo enero 2026)
  const [center, setCenter] = useState<Date>(() => clampMinDate(new Date()))
  const days = useMemo(() => daysWindow(center, 15, 15), [center])

  const [employees, setEmployees] = useState<EmployeeRow[]>([])
  const [requests, setRequests] = useState<ReqRow[]>([])
  const [holidays, setHolidays] = useState<HolidayRow[]>([])
  const [homeOffices, setHomeOffices] = useState<HomeOfficeRow[]>([])

  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  /* =======================
     Load data
  ======================= */
  async function load() {
    setLoading(true)
    setErr(null)

    const [empRes, reqRes, holRes, hoRes] = await Promise.all([
      supabase
        .from("employees")
        // ✅ CAMBIO: traer pending_current y pending_previous
        .select("id, first_name, last_name, legajo, position, area, start_date, active, pending_current, pending_previous")
        .order("last_name"),

      supabase
        .from("vacation_requests")
        .select("id, employee_id, start_date, end_date, requested_days, status, created_at")
        .order("created_at", { ascending: false }),

      supabase
        .from("holidays")
        .select("date, name"),

      supabase
        .from("home_office_requests")
        .select("id, employee_id, request_date, status, created_at")
        .order("created_at", { ascending: false }),
    ])

    if (empRes.error) setErr(empRes.error.message)
    if (reqRes.error) setErr(reqRes.error.message)
    if (holRes.error) setErr(holRes.error.message)
    if (hoRes.error) setErr(hoRes.error.message)

    setEmployees(((empRes.data || []) as any).filter((e: any) => e.active !== false))
    setRequests((reqRes.data || []) as any)
    setHolidays((holRes.data || []) as any)
    setHomeOffices((hoRes.data || []) as any)

    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  // Seguridad extra: nunca ir antes de enero 2026
  useEffect(() => {
    setCenter((prev) => (prev < MIN_DATE ? MIN_DATE : prev))
  }, [])

  /* =======================
     Navigation
  ======================= */
  const shiftDays = (delta: number) => {
    setCenter((d) => {
      const next = new Date(d)
      next.setDate(next.getDate() + delta)
      return next < MIN_DATE ? MIN_DATE : next
    })
  }

  const goToday = () => {
    const now = new Date()
    setCenter(now < MIN_DATE ? MIN_DATE : now)
  }

  /* =======================
     Labels
  ======================= */
  const monthLabel = useMemo(() => {
    const s = fmtMonthYear(center)
    return s.charAt(0).toUpperCase() + s.slice(1)
  }, [center])

  const todayLabel = fmtFullLong(center)

  /* =======================
     Timeline data
  ======================= */
  // ✅ IMPORTANTE: el año del saldo lo tomamos del center (así en 2026 muestra 2026)
  const balanceYear = center.getFullYear()

  const timelineEmployees = employees.map((e) => ({
    id: e.id,
    legajo: e.legajo,
    firstName: e.first_name,
    lastName: e.last_name,
    position: e.position,
    area: e.area,
    startDate: String(e.start_date).slice(0, 10),
    active: true,

    // ✅ CAMBIO: saldo real desde Supabase
    balance: {
      year: balanceYear,
      pendingCurrent: Number(e.pending_current ?? 0),
      pendingPrevious: Number(e.pending_previous ?? 0),
      used: 0,
    },
  })) as any[]

  const timelineRequests = requests.map((r) => ({
    id: r.id,
    employeeId: r.employee_id,
    startDate: String(r.start_date).slice(0, 10),
    endDate: String(r.end_date).slice(0, 10),
    requestedDays: Number(r.requested_days || 0),
    status: (r.status || "pending") as any,
    createdAt: String(r.created_at || "").slice(0, 10),
  })) as any[]

  const timelineHomeOffices = homeOffices.map((h) => ({
    id: h.id,
    employeeId: h.employee_id,
    date: String((h as any).request_date ?? (h as any).date).slice(0, 10),
    status: (h.status || "pending") as any,
    createdAt: String(h.created_at || "").slice(0, 10),
  })) as any[]

  // Map de feriados: YYYY-MM-DD → nombre
  const holidayMap = useMemo(() => {
    const m = new Map<string, string>()
    holidays.forEach((h) => m.set(h.date, h.name))
    return m
  }, [holidays])

  /* =======================
     KPIs
  ======================= */
  const today = new Date()

  const onVacation = employees.filter((e) =>
    requests.some(
      (r) =>
        r.employee_id === e.id &&
        r.status === "approved" &&
        new Date(r.start_date) <= today &&
        new Date(r.end_date) >= today
    )
  ).length

  const pendingApprovals = requests.filter((r) => r.status === "pending").length

  const homeOfficeToday = homeOffices.filter(
    (h) =>
      h.status === "approved" &&
      String(((h as any).request_date ?? (h as any).date)).slice(0, 10) === String(today.toISOString()).slice(0, 10)
  ).length

  const winStart = days[0]
  const winEnd = days[days.length - 1]

  const next15 = requests
    .filter((r) => r.status === "approved")
    .filter((r) => {
      const s = new Date(r.start_date)
      const e = new Date(r.end_date)
      return s <= winEnd && e >= winStart
    }).length

  /* =======================
     Render
  ======================= */
  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-5">
        <Kpi icon={Users} label="Activos" value={employees.length} />
        <Kpi icon={Plane} label="De vacaciones hoy" value={onVacation} />
        <Kpi icon={Clock} label="Pendientes" value={pendingApprovals} />
        <Kpi icon={Home} label="Home office hoy" value={homeOfficeToday} />
        <Kpi icon={CalendarDays} label="Dentro de ±15" value={next15} />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Mapa visual (Timeline)</CardTitle>
            <CardDescription>Vacaciones, feriados y estado general</CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={() => shiftDays(-15)}>-15</Button>
            <Button variant="secondary" onClick={goToday}>Hoy</Button>
            <Button variant="secondary" onClick={() => shiftDays(+15)}>+15</Button>
            <Button variant="outline" onClick={load} disabled={loading}>
              {loading ? "Cargando…" : "Actualizar"}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {err && <div className="mb-3 text-sm text-red-600">{err}</div>}

          {/* Fecha clara */}
          <div className="mb-3">
            <div className="text-sm font-semibold text-slate-900">{monthLabel}</div>
            <div className="text-xs text-slate-500">{todayLabel}</div>
          </div>

          {/* Leyenda */}
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="approved">Aprobadas</Badge>
            <Badge variant="pending">Pendientes</Badge>
            <Badge variant="homeoffice">Home Office</Badge>
            <Badge className="bg-red-50 text-red-700 border-red-200">Feriado</Badge>
          </div>

          {loading ? (
            <div className="text-sm text-slate-500">Cargando…</div>
          ) : (
            <Timeline
              days={days}
              employees={timelineEmployees}
              requests={timelineRequests}
              holidays={holidayMap}
              homeOffices={timelineHomeOffices}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/* =======================
   KPI Card
======================= */
function Kpi({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>{label}</CardTitle>
          <CardDescription>Resumen</CardDescription>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-2">
          <Icon className="h-4 w-4 text-slate-700" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
      </CardContent>
    </Card>
  )
}
