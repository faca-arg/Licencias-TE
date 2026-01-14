import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Swords,
  Trees,
  CalendarDays,
  Radar,
  Trophy,
} from "lucide-react"

const realms = [
  { name: "Trabajo", visual: "Ciudad", level: 12, progress: 72, tone: "bg-emerald-400" },
  { name: "Dinero", visual: "Torre", level: 9, progress: 58, tone: "bg-lime-300" },
  { name: "Cuerpo", visual: "Árbol", level: 14, progress: 84, tone: "bg-emerald-300" },
  { name: "Creatividad", visual: "Jardín", level: 7, progress: 42, tone: "bg-lime-200" },
  { name: "Relaciones", visual: "Fuego", level: 11, progress: 66, tone: "bg-emerald-200" },
  { name: "Casamiento", visual: "Constelación", level: 5, progress: 35, tone: "bg-lime-100" },
]

const coreLoop = [
  {
    title: "Diseñar el día",
    description: "Elegís misiones breves, medibles y ligadas a un Reino.",
  },
  {
    title: "Actuar en el mundo real",
    description: "Cada acción real suma XP con feedback inmediato.",
  },
  {
    title: "Registrar y sentir",
    description: "El calendario y los organismos visuales muestran el impacto.",
  },
  {
    title: "Evolucionar",
    description: "Subís de nivel, desbloqueás temporadas y cambios visuales.",
  },
]

const pillars = [
  "Progreso visual vivo (no solo números)",
  "Rachas diarias y temporadas épicas",
  "Misiones personalizadas con dificultad",
  "Feedback emocional: culpa, orgullo, transformación",
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-lime-300/10" />
        <CardHeader className="relative space-y-4">
          <Badge className="w-fit" variant="approved">
            LIFE:180 • Sistema de gamificación existencial
          </Badge>
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <CardTitle className="text-2xl sm:text-3xl text-white">
                Convertí tu vida en un videojuego vivo.
              </CardTitle>
              <CardDescription className="text-sm text-emerald-100/80">
                LIFE:180 transforma hábitos reales en XP, niveles, temporadas y un universo que
                evoluciona. El calendario es el tablero central: cada día deja huella.
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Button>Iniciar día épico</Button>
                <Button variant="outline">Ver calendario</Button>
              </div>
            </div>
            <div className="space-y-3 rounded-2xl border border-emerald-500/20 bg-[#0b110d]/80 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                Estado del jugador
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Stat label="Nivel global" value="28" icon={Trophy} />
                <Stat label="XP hoy" value="860" icon={Sparkles} />
                <Stat label="Racha" value="19 días" icon={Radar} />
              </div>
              <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3">
                <div className="text-xs text-emerald-100/70">Mensaje diario</div>
                <div className="text-sm text-white">
                  “Hoy tus reinos necesitan 3 misiones clave para desbloquear el Día Épico.”
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Loop central de progreso</CardTitle>
            <CardDescription>Un ciclo diario que genera hábito emocional.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {coreLoop.map((step, index) => (
              <div key={step.title} className="flex gap-3 rounded-2xl border border-emerald-500/10 bg-[#0b110d]/60 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-100">
                  0{index + 1}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{step.title}</div>
                  <div className="text-xs text-emerald-100/70">{step.description}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Principios de diseño</CardTitle>
            <CardDescription>Minimalismo oscuro + verde, emoción y progreso visible.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pillars.map((pillar) => (
              <div key={pillar} className="flex items-center gap-2 text-sm text-emerald-100/80">
                <span className="h-2 w-2 rounded-full bg-lime-300" />
                {pillar}
              </div>
            ))}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-emerald-100/70">
              Inspiración visual: atmósfera etérea y emocional estilo Deftones, con interfaces premium.
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Trees className="h-4 w-4 text-emerald-300" />
          <h2 className="text-lg font-semibold text-white">Seis reinos en evolución</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {realms.map((realm) => (
            <Card key={realm.name}>
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{realm.name}</CardTitle>
                  <Badge variant="pending">Nivel {realm.level}</Badge>
                </div>
                <CardDescription>{realm.visual} vivo que reacciona a tus acciones.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-2 w-full rounded-full bg-emerald-950">
                  <div
                    className={`h-full rounded-full ${realm.tone}`}
                    style={{ width: `${realm.progress}%` }}
                  />
                </div>
                <div className="text-xs text-emerald-100/70">Progreso {realm.progress}% • Estado: estable</div>
                <div className="rounded-2xl border border-emerald-500/10 bg-[#0b110d]/70 p-3 text-xs text-emerald-100/70">
                  Organismo visual: {realm.visual} luminoso, con partículas y textura viva.
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendario como centro</CardTitle>
            <CardDescription>Vista anual estilo GitHub con impacto emocional por día.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Highlight label="Día épico" description="Brilla y suena al desbloquear logros." icon={Swords} />
              <Highlight label="Día activo" description="Colores según reinos tocados." icon={CalendarDays} />
              <Highlight label="Día muerto" description="Gris silencioso que motiva retorno." icon={Sparkles} />
            </div>
            <div className="rounded-2xl border border-emerald-500/10 bg-[#0b110d]/70 p-4 text-xs text-emerald-100/70">
              Al tocar un día se despliega: misiones completadas, XP ganado, reinos que suben o bajan.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Feedback diario</CardTitle>
            <CardDescription>Recompensa, urgencia y evolución emocional.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-emerald-100/80">
            <p>✔️ Bonus de XP por completar 3 reinos al día.</p>
            <p>🔥 Buff de racha que acelera el crecimiento visual.</p>
            <p>⚠️ Penalización suave si un reino queda sin tocar 3 días.</p>
            <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-3 text-xs text-emerald-100/70">
              Cada feedback busca generar culpa productiva y orgullo visible.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<any> }) {
  return (
    <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-3">
      <div className="flex items-center justify-between">
        <div className="text-xs text-emerald-100/60">{label}</div>
        <Icon className="h-4 w-4 text-emerald-200" />
      </div>
      <div className="text-lg font-semibold text-white">{value}</div>
    </div>
  )
}

function Highlight({
  label,
  description,
  icon: Icon,
}: {
  label: string
  description: string
  icon: React.ComponentType<any>
}) {
  return (
    <div className="rounded-2xl border border-emerald-500/10 bg-[#0b110d]/60 p-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <Icon className="h-4 w-4 text-emerald-200" />
        {label}
      </div>
      <div className="text-xs text-emerald-100/70">{description}</div>
    </div>
  )
}
