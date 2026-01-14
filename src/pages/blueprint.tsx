import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Network, Layers, Boxes, Workflow } from "lucide-react"

const architecture = [
  {
    title: "Frontend",
    items: ["Next.js + React", "Framer Motion para transiciones", "Tailwind + Radix UI"],
  },
  {
    title: "Backend",
    items: ["Supabase (Postgres + Storage)", "Edge Functions para XP", "Realtime para feedback"],
  },
  {
    title: "Auth",
    items: ["Magic Link por email", "Roles básicos: jugador / mentor"],
  },
]

const dataModel = [
  {
    entity: "users",
    fields: ["id", "email", "display_name", "season_id", "created_at"],
  },
  {
    entity: "realms",
    fields: ["id", "user_id", "name", "level", "xp", "health_state"],
  },
  {
    entity: "missions",
    fields: ["id", "user_id", "realm_id", "title", "difficulty", "xp", "schedule_at"],
  },
  {
    entity: "mission_logs",
    fields: ["id", "mission_id", "status", "logged_at", "xp_earned"],
  },
  {
    entity: "day_stats",
    fields: ["id", "user_id", "date", "xp_total", "realms_touched", "epic"],
  },
  {
    entity: "seasons",
    fields: ["id", "name", "starts_at", "ends_at", "theme"],
  },
]

const components = [
  "App Shell + navegación lateral",
  "RealmCard (organismo vivo)",
  "MissionBuilder",
  "CalendarHeatmap",
  "DayDrawer (detalles del día)",
  "SeasonProgress",
]

const wireframes = [
  {
    title: "Dashboard",
    description: "Hero + stats + reinos + calendario.",
  },
  {
    title: "Reino",
    description: "Organismo central + misiones + historial.",
  },
  {
    title: "Calendario",
    description: "Heatmap anual + drawer lateral.",
  },
  {
    title: "Misiones",
    description: "Builder + backlog + programación.",
  },
]

const animations = [
  "Transiciones suaves entre reinos (Framer Motion).",
  "Grow / decay en organismos según XP diario.",
  "Partículas y glow en días épicos.",
  "Hover sutil en tarjetas con blur y brillo.",
]

const userFlow = [
  "Onboarding: elegir visión 180 días + definir 6 reinos.",
  "Crear primera misión por reino.",
  "Completar misiones diarias y ver evolución.",
  "Revisión semanal con insights y ajustes.",
]

export function BlueprintPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-emerald-300" />
            <CardTitle>Arquitectura técnica</CardTitle>
          </div>
          <CardDescription>
            Stack recomendado para un MVP escalable y con feedback en tiempo real.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {architecture.map((block) => (
            <div key={block.title} className="rounded-2xl border border-emerald-500/10 bg-[#0b110d]/70 p-4">
              <div className="text-sm font-semibold text-white">{block.title}</div>
              <ul className="mt-2 space-y-1 text-xs text-emerald-100/70">
                {block.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-300" />
              <CardTitle>Modelo de datos</CardTitle>
            </div>
            <CardDescription>Estructura base para XP, misiones y temporadas.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {dataModel.map((entity) => (
              <div key={entity.entity} className="rounded-2xl border border-emerald-500/10 bg-[#0b110d]/70 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white">{entity.entity}</div>
                  <Badge variant="pending">Table</Badge>
                </div>
                <div className="mt-2 text-xs text-emerald-100/70">
                  {entity.fields.join(" • ")}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Boxes className="h-4 w-4 text-emerald-300" />
              <CardTitle>Componentes clave</CardTitle>
            </div>
            <CardDescription>Bloques de UI que generan sensación premium.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-emerald-100/80">
            {components.map((component) => (
              <div key={component} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-lime-300" />
                {component}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Workflow className="h-4 w-4 text-emerald-300" />
              <CardTitle>Wireframes clave</CardTitle>
            </div>
            <CardDescription>Layout de pantallas esenciales para MVP.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {wireframes.map((wireframe) => (
              <div key={wireframe.title} className="rounded-2xl border border-emerald-500/10 bg-[#0b110d]/70 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white">{wireframe.title}</div>
                  <Badge>Wireframe</Badge>
                </div>
                <div className="mt-2 text-xs text-emerald-100/70">{wireframe.description}</div>
                <div className="mt-3 grid gap-2">
                  <div className="h-2 w-full rounded-full bg-emerald-950" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-8 rounded-lg bg-emerald-950" />
                    <div className="h-8 rounded-lg bg-emerald-950" />
                    <div className="h-8 rounded-lg bg-emerald-950" />
                  </div>
                  <div className="h-12 rounded-lg bg-emerald-950" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Animaciones y transiciones</CardTitle>
            <CardDescription>Sensación Framer Motion + feedback emocional.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-emerald-100/80">
            {animations.map((item) => (
              <p key={item}>• {item}</p>
            ))}
            <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-3 text-xs text-emerald-100/70">
              Cada animación refuerza orgullo (crecimiento) y culpa (decaimiento).
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Flujo de usuario</CardTitle>
          <CardDescription>La ruta emocional desde el onboarding al hábito diario.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-emerald-100/80">
          {userFlow.map((step) => (
            <div key={step} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-lime-300" />
              {step}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
