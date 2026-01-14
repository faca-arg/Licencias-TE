import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Route, Rocket, Wand2 } from "lucide-react"

const roadmap = [
  {
    phase: "MVP (0-6 semanas)",
    tag: "Launch",
    items: [
      "Onboarding + definición de 6 reinos",
      "Misiones personalizadas con XP",
      "Calendario heatmap + detalle diario",
      "Visuales básicos de organismos",
      "Magic link + perfiles",
    ],
  },
  {
    phase: "Evolución (7-12 semanas)",
    tag: "Growth",
    items: [
      "Temporadas narrativas + objetivos",
      "Misiones épicas y sinergias",
      "Insights semanales + ajustes",
      "Biblioteca de plantillas",
      "Notificaciones emocionales",
    ],
  },
  {
    phase: "Producto completo (13-24 semanas)",
    tag: "Scale",
    items: [
      "Organismos 3D con audio reactivo",
      "Sistema de logros y coleccionables",
      "Modo mentor + retos colaborativos",
      "Integraciones (calendar, health, finance)",
      "Marketplace de temporadas",
    ],
  },
]

const successMetrics = [
  "DAU/MAU > 0.45",
  "Racha promedio de 12 días",
  "70% de usuarios completan 3 reinos diarios",
  "Tiempo en app < 6 minutos (rápido y adictivo)",
]

export function RoadmapPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-emerald-300" />
            <CardTitle>Roadmap de producto</CardTitle>
          </div>
          <CardDescription>De MVP funcional a sistema de evolución humana completo.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {roadmap.map((phase) => (
            <div key={phase.phase} className="rounded-2xl border border-emerald-500/10 bg-[#0b110d]/70 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">{phase.phase}</div>
                <Badge variant="approved">{phase.tag}</Badge>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-emerald-100/70">
                {phase.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-emerald-300" />
              <CardTitle>Métricas de éxito</CardTitle>
            </div>
            <CardDescription>Indicadores para validar el impacto emocional.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-emerald-100/80">
            {successMetrics.map((metric) => (
              <div key={metric} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-lime-300" />
                {metric}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-emerald-300" />
              <CardTitle>Visión final</CardTitle>
            </div>
            <CardDescription>Una app que convierte disciplina en narrativa personal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-emerald-100/80">
            <p>• Cada día se siente como una misión principal de un RPG.</p>
            <p>• Los reinos reflejan emociones reales, no solo números.</p>
            <p>• El usuario se transforma sin darse cuenta: jugando.</p>
            <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-3 text-xs text-emerald-100/70">
              Objetivo: generar hábito diario, culpa productiva y orgullo visible.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
