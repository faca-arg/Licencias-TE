import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ListTodo, Swords, CalendarPlus, Gauge } from "lucide-react"

const missions = [
  {
    title: "Deep Work 90m",
    realm: "Trabajo",
    difficulty: "Difícil",
    xp: 240,
    schedule: "Lun • 07:30",
  },
  {
    title: "Entrenamiento fuerza",
    realm: "Cuerpo",
    difficulty: "Media",
    xp: 160,
    schedule: "Mar • 19:00",
  },
  {
    title: "Plan financiero semanal",
    realm: "Dinero",
    difficulty: "Media",
    xp: 140,
    schedule: "Dom • 20:00",
  },
  {
    title: "Crear 1 pieza visual",
    realm: "Creatividad",
    difficulty: "Alta",
    xp: 220,
    schedule: "Vie • 10:00",
  },
]

const difficultyLegend = [
  { label: "Baja", value: "+60 XP" },
  { label: "Media", value: "+140 XP" },
  { label: "Alta", value: "+220 XP" },
  { label: "Épica", value: "+320 XP" },
]

export function MissionsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ListTodo className="h-4 w-4 text-emerald-300" />
            <CardTitle>Misiones personalizadas</CardTitle>
          </div>
          <CardDescription>
            Cada misión define dificultad, XP, calendario y Reino asociado.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-500/10 bg-[#0b110d]/70 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">Editor rápido</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="Título" value="Meditación 15m" />
                <Field label="Reino" value="Relaciones" />
                <Field label="Dificultad" value="Media" />
                <Field label="XP" value="+140" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm">Crear misión</Button>
                <Button size="sm" variant="outline">Guardar plantilla</Button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {difficultyLegend.map((item) => (
                <div key={item.label} className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-3">
                  <div className="text-sm font-semibold text-white">{item.label}</div>
                  <div className="text-xs text-emerald-100/70">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-emerald-500/10 bg-[#0b110d]/70 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">Calendario de misiones</div>
                <CalendarPlus className="h-4 w-4 text-emerald-200" />
              </div>
              <div className="mt-3 space-y-2 text-xs text-emerald-100/80">
                <p>• Bloqueo inteligente según energía y disponibilidad.</p>
                <p>• Misiones épicas solo 2 por semana.</p>
                <p>• Ajuste automático de XP por consistencia.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Gauge className="h-4 w-4 text-emerald-200" />
                Balance de carga
              </div>
              <div className="mt-2 text-xs text-emerald-100/70">
                El sistema evita saturar un solo Reino y sugiere balance diario.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Misiones activas</CardTitle>
            <CardDescription>Asignadas al calendario y listas para ejecutar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {missions.map((mission) => (
              <div key={mission.title} className="rounded-2xl border border-emerald-500/10 bg-[#0b110d]/70 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white">{mission.title}</div>
                  <Badge variant="pending">{mission.xp} XP</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-emerald-100/70">
                  <span>{mission.realm}</span>
                  <span>• {mission.difficulty}</span>
                  <span>• {mission.schedule}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Swords className="h-4 w-4 text-lime-300" />
              <CardTitle>Misiones épicas</CardTitle>
            </div>
            <CardDescription>Retos que cambian el mundo y aceleran el progreso.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-emerald-100/80">
            <p>• Solo desbloqueables si completás 4 reinos en un día.</p>
            <p>• Efecto visual único en tu Reino principal.</p>
            <p>• Otorgan XP extra y desbloquean nuevos niveles de temporada.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-3">
      <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">{label}</div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  )
}
