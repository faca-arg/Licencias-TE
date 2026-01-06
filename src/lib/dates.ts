import {
  addDays,
  differenceInCalendarDays,
  format,
  isAfter,
  isBefore,
  isSameDay,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns"
import { es } from "date-fns/locale"

/* ===============================
   Configuración global de fechas
================================ */
export const MIN_DATE = new Date(2026, 0, 1)

export function clampMinDate(d: Date) {
  return d < MIN_DATE ? MIN_DATE : d
}

export function titleCase(s: string) {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/* ===============================
   Helpers de rango
================================ */
export function daysWindow(center: Date, before = 15, after = 15) {
  const c = clampMinDate(center)
  const start = addDays(c, -before)
  const end = addDays(c, after)
  return eachDayOfInterval({ start, end })
}

/* ===============================
   Formatos (ES)
================================ */
export function fmtDay(d: Date) {
  return format(d, "dd", { locale: es })
}

export function fmtDow(d: Date) {
  // lun, mar, mié
  return format(d, "EEE", { locale: es })
}

export function fmtFull(d: Date) {
  return format(d, "yyyy-MM-dd")
}

export function fmtFullLong(d: Date) {
  // lunes, 5 de enero de 2026
  return format(d, "PPPP", { locale: es })
}

export function fmtMonthYear(d: Date) {
  // enero 2026
  return format(d, "MMMM yyyy", { locale: es })
}

/* ===============================
   Lógica de vacaciones (base)
================================ */
export function inRange(day: Date, startISO: string, endISO: string) {
  const s = parseISO(startISO)
  const e = parseISO(endISO)
  return (isSameDay(day, s) || isAfter(day, s)) && (isSameDay(day, e) || isBefore(day, e))
}

export function overlap(startA: string, endA: string, startB: string, endB: string) {
  const a1 = parseISO(startA)
  const a2 = parseISO(endA)
  const b1 = parseISO(startB)
  const b2 = parseISO(endB)
  return !(isBefore(a2, b1) || isAfter(a1, b2))
}

export function monthDays(anchor: Date) {
  const a = clampMinDate(anchor)
  const start = startOfMonth(a)
  const end = endOfMonth(a)
  return eachDayOfInterval({ start, end })
}

export function diffDaysInclusive(startISO: string, endISO: string) {
  return differenceInCalendarDays(parseISO(endISO), parseISO(startISO)) + 1
}

/* ===============================
   ✅ NUEVO: Vacaciones por DÍAS HÁBILES
   - No cuentan sáb/dom
   - No cuentan feriados (tabla holidays)
   holidayMap: Map<"YYYY-MM-DD", "Nombre">
================================ */

// ISO helper (yyyy-MM-dd)
export function iso(d: Date) {
  return format(d, "yyyy-MM-dd")
}

export function isWeekend(d: Date) {
  const x = d.getDay()
  return x === 0 || x === 6 // domingo(0) o sábado(6)
}

export function isHolidayISO(dayISO: string, holidayMap?: Map<string, string>) {
  return !!holidayMap?.has(dayISO)
}

export function isNonWorking(d: Date, holidayMap?: Map<string, string>) {
  return isWeekend(d) || isHolidayISO(iso(d), holidayMap)
}

/**
 * Cuenta días de vacaciones (hábiles) dentro de un rango INCLUSIVE.
 * Ej: lun->vie (sin feriados) = 5
 */
export function countVacationDaysInclusive(
  startISO: string,
  endISO: string,
  holidayMap?: Map<string, string>
) {
  let d = parseISO(startISO)
  const end = parseISO(endISO)

  // si el rango está invertido, devolvemos 0 (evita bugs en UI)
  if (d > end) return 0

  let count = 0
  while (d <= end) {
    if (!isNonWorking(d, holidayMap)) count++
    d = addDays(d, 1)
  }
  return count
}

/**
 * Dado un startISO + N días hábiles, devuelve:
 * - endISO: último día “de licencia” (calendario)
 * - returnISO: día hábil de regreso (se extiende por feriados/sáb/dom)
 */
export function computeEndAndReturnFromStart(
  startISO: string,
  requestedDays: number,
  holidayMap?: Map<string, string>
) {
  const days = Math.max(0, Number(requestedDays || 0))
  let d = parseISO(startISO)

  // Si el inicio cae en no hábil, arrancamos desde el próximo hábil
  while (isNonWorking(d, holidayMap)) d = addDays(d, 1)

  // Caso especial: si piden 0, end = start ajustado, regreso = próximo hábil
  if (days === 0) {
    let ret0 = addDays(d, 1)
    while (isNonWorking(ret0, holidayMap)) ret0 = addDays(ret0, 1)
    return { endISO: iso(d), returnISO: iso(ret0) }
  }

  let used = 0
  let end = d

  while (used < days) {
    if (!isNonWorking(d, holidayMap)) {
      used++
      end = d
    }
    d = addDays(d, 1)
  }

  // regreso: próximo día hábil luego del end
  let ret = addDays(end, 1)
  while (isNonWorking(ret, holidayMap)) ret = addDays(ret, 1)

  return { endISO: iso(end), returnISO: iso(ret) }
}

/**
 * Dado endISO, calcula el regreso hábil
 */
export function computeReturnFromEnd(endISO: string, holidayMap?: Map<string, string>) {
  let ret = addDays(parseISO(endISO), 1)
  while (isNonWorking(ret, holidayMap)) ret = addDays(ret, 1)
  return iso(ret)
}
