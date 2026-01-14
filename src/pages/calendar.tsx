import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Sparkles } from "lucide-react"

const dayStates = [
  { label: "Muerto", className: "bg-slate-700" },
  { label: "1 reino", className: "bg-emerald-900" },
  { label: "2 reinos", className: "bg-emerald-700" },
  { label: "3 reinos", className: "bg-emerald-500" },
  { label: "Épico", className: "bg-lime-300" },
]

const calendarDays = Array.from({ length: 84 }, (_, i) => {
  const intensity = [0, 1, 1, 2, 2, 3, 4][i % 7]
  return {
    id: i,
    intensity,
    date: `Día ${i + 1}`,
  }
})

const dayDetail = {
  date: "Viernes 18",
  xp: 520,
  missions: [
    "Workout 45m (Cuerpo) +120 XP",
    "Pitch de proyecto (Trabajo) +200 XP",
    "Llamada profunda (Relaciones) +200 XP",
  ],
  impacts: [
    "Cuerpo +1 nivel (Árbol florece)",
    "Relaciones +2% (Fuego más intenso)",
    "Trabajo +1% (Ciudad iluminada)",
  ],
}

export function CalendarPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-emerald-300" />
            <CardTitle>Calendario anual tipo GitHub</CardTitle>
          </div>
          <CardDescription>
            El centro emocional del producto: cada día es un bloque que cambia según reinos tocados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="grid grid-cols-12 gap-2">
                {calendarDays.map((day) => (
                  <div
                    key={day.id}
                    className={`h-6 w-6 rounded-md ${dayStates[day.intensity].className}`}
                    title={day.date}
                  />
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-emerald-100/70">
                {dayStates.map((state) => (
                  <div key={state.label} className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded ${state.className}`} />
                    {state.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3 rounded-2xl border border-emerald-500/10 bg-[#0b110d]/70 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">{dayDetail.date}</div>
                <Badge variant="approved">+{dayDetail.xp} XP</Badge>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">Misiones</div>
                <ul className="mt-2 space-y-1 text-xs text-emerald-100/80">
                  {dayDetail.missions.map((mission) => (
                    <li key={mission}>• {mission}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">Impacto</div>
                <ul className="mt-2 space-y-1 text-xs text-emerald-100/80">
                  {dayDetail.impacts.map((impact) => (
                    <li key={impact}>• {impact}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3 text-xs text-emerald-100/70">
                Días épicos brillan y desbloquean cinemáticas cortas del mundo.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vista mensual y por temporada</CardTitle>
            <CardDescription>Filtros para analizar consistencia y crecimiento.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-emerald-100/80">
            <p>• Métricas de consistencia por Reino.</p>
            <p>• Comparativa entre meses (tendencia de XP).</p>
            <p>• Temporadas con objetivos narrativos únicos.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Día épico</CardTitle>
            <CardDescription>Al tocar 4+ reinos en un día se dispara el modo épico.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-emerald-100/80">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-lime-300" />
              Recompensa visual: partículas, brillo y música ambiental.
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-lime-300" />
              Recompensa sistémica: +15% XP y crecimiento acelerado.
            </div>
            <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3 text-xs text-emerald-100/70">
              Un día muerto se siente gris, silencioso y empuja a la acción.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
