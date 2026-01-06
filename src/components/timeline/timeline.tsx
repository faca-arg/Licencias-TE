import { useMemo } from "react"
import type { Employee, VacationRequest, HomeOfficeRequest } from "@/data/models"
import { cn } from "@/lib/utils"
import { fmtDay, fmtDow, fmtFull, inRange, fmtMonthYear } from "@/lib/dates"

function cap(s: string) {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function isWeekend(d: Date) {
  const day = d.getDay()
  return day === 0 || day === 6 // domingo(0) o sábado(6)
}

export function Timeline({
  days,
  employees,
  requests,
  holidays,
  homeOffices,
}: {
  days: Date[]
  employees: Employee[]
  requests: VacationRequest[]
  holidays: Map<string, string>
  homeOffices?: HomeOfficeRequest[]
}) {
  const dayLabels = useMemo(
    () =>
      days.map((d) => ({
        d,
        key: fmtFull(d),
        day: fmtDay(d),
        dow: fmtDow(d),
        weekend: isWeekend(d),
      })),
    [days]
  )

  const monthLabel = useMemo(() => {
    if (!days.length) return ""
    return cap(fmtMonthYear(days[0]))
  }, [days])

  const todayKey = fmtFull(new Date())

  return (
    <div className="overflow-auto scrollbar-thin rounded-2xl border border-slate-200/70 bg-white">
      <div
        className="min-w-[980px]"
        style={{
          display: "grid",
          gridTemplateColumns: `280px repeat(${dayLabels.length}, minmax(34px, 1fr))`,
        }}
      >
        {/* Month label */}
        <div className="sticky left-0 top-0 z-30 col-span-full border-b border-slate-200 bg-slate-50 px-3 py-2">
          <div className="text-sm font-semibold text-slate-900">{monthLabel}</div>
        </div>

        {/* Header left */}
        <div className="sticky left-0 top-[40px] z-20 border-b border-slate-200 bg-white/95 p-3 text-xs font-semibold text-slate-700">
          Empleado
        </div>

        {/* Header days */}
        {dayLabels.map(({ key, day, dow, weekend }) => {
          const isToday = key === todayKey
          const isHoliday = holidays?.has(key)
          const holidayName = holidays?.get(key)
          const dowES = String(dow).replace(".", "").toUpperCase()

          return (
            <div
              key={key}
              className={cn(
                "sticky top-[40px] z-10 border-b px-1 py-2 text-center text-[10px] leading-tight",
                isToday
                  ? "bg-slate-900 text-white border-slate-900"
                  : isHoliday
                  ? "bg-red-50 text-red-700 border-red-200"
                  : weekend
                  ? "bg-slate-100 text-slate-500 border-slate-200"
                  : "bg-white/95 text-slate-500 border-slate-200"
              )}
              title={
                isHoliday
                  ? `Feriado: ${holidayName}`
                  : weekend
                  ? "Fin de semana"
                  : key
              }
            >
              <div className={cn("font-semibold", isToday && "text-white")}>{day}</div>
              <div className={cn("uppercase", isToday && "text-white/80")}>{dowES}</div>
            </div>
          )
        })}

        {/* Rows */}
        {employees.map((e) => (
          <Row
            key={e.id}
            employee={e}
            dayLabels={dayLabels}
            requests={requests}
            holidays={holidays}
            homeOffices={homeOffices}
            todayKey={todayKey}
          />
        ))}
      </div>
    </div>
  )
}

function Row({
  employee,
  dayLabels,
  requests,
  holidays,
  homeOffices,
  todayKey,
}: {
  employee: Employee
  dayLabels: { d: Date; key: string; weekend: boolean }[]
  requests: VacationRequest[]
  holidays: Map<string, string>
  homeOffices?: HomeOfficeRequest[]
  todayKey: string
}) {
  const empReq = requests.filter(
    (r) => r.employeeId === employee.id && (r.status === "approved" || r.status === "pending")
  )

  const empHO = (homeOffices || []).filter(
    (h) => h.employeeId === employee.id && (h.status === "approved" || h.status === "pending")
  )

  return (
    <>
      {/* Left sticky employee cell */}
      <div className="sticky left-0 z-10 border-b border-slate-200 bg-white px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {employee.firstName} {employee.lastName}
            </div>
            <div className="text-xs text-slate-500">
              Legajo {employee.legajo} • {employee.area} • {employee.position}
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-500">
            <div>Saldo {employee.balance.year}</div>
            <div className="font-medium text-slate-700">
              {employee.balance.pendingCurrent + employee.balance.pendingPrevious} días
            </div>
          </div>
        </div>
      </div>

      {/* Day cells */}
      {dayLabels.map(({ d, key, weekend }) => {
        const hit = empReq.find((r) => inRange(d, r.startDate, r.endDate))
        const ho = empHO.find((h) => h.date === key)
        const isToday = key === todayKey
        const isHoliday = holidays?.has(key)
        const holidayName = holidays?.get(key)

        return (
          <div
            key={key}
            className={cn(
              "relative border-b border-slate-200 px-0.5 py-0", // ✅ sin padding vertical
              isToday && "bg-slate-50",
              !isToday && isHoliday && "bg-red-50/40",
              !isToday && !isHoliday && weekend && "bg-slate-100/60"
            )}
            title={
              isHoliday
                ? `Feriado: ${holidayName}`
                : weekend
                ? "Fin de semana"
                : undefined
            }
          >
            {/* ✅ el bloque ocupa todo el alto de la fila */}
            <div className="h-full py-1">
              {hit ? (
                <div
                  className={cn(
                    "h-full w-full rounded-lg",
                    hit.status === "approved"
                      ? "bg-emerald-500/20 ring-1 ring-emerald-500/30"
                      : "bg-amber-500/20 ring-1 ring-amber-500/30"
                  )}
                  title={`${hit.status.toUpperCase()} • ${hit.startDate} → ${hit.endDate}`}
                />
              ) : (
                <div className="h-full w-full rounded-lg bg-transparent" />
              )}

              {/* Home Office: indicador (no tapa vacaciones) */}
              {ho && !hit && (
                <div
                  className={cn(
                    "absolute inset-1 rounded-lg",
                    ho.status === "approved"
                      ? "bg-sky-500/20 ring-1 ring-sky-500/30"
                      : "bg-amber-500/10 ring-1 ring-amber-500/20"
                  )}
                  title={`HOME OFFICE • ${ho.status.toUpperCase()} • ${ho.date}`}
                />
              )}
            </div>
          </div>
        )
      })}
    </>
  )
}
