import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trees, Building2, Landmark, Flame, Sparkles, Orbit } from "lucide-react"

const realms = [
  {
    name: "Cuerpo",
    visual: "Árbol",
    icon: Trees,
    status: "Floreciendo",
    details: "El árbol crece con cada entrenamiento y se marchita si falta movimiento.",
    cues: ["Raíces más profundas", "Hojas luminosas", "Frutos al superar retos"],
  },
  {
    name: "Dinero",
    visual: "Torre",
    icon: Landmark,
    status: "Construyendo",
    details: "Cada decisión financiera añade pisos y estabilidad.",
    cues: ["Altura visible", "Luces doradas", "Puentes hacia nuevos ingresos"],
  },
  {
    name: "Trabajo",
    visual: "Ciudad",
    icon: Building2,
    status: "En expansión",
    details: "Proyectos terminados iluminan barrios completos.",
    cues: ["Calles activas", "Vehículos en movimiento", "Distritos desbloqueados"],
  },
  {
    name: "Creatividad",
    visual: "Jardín",
    icon: Sparkles,
    status: "Brote nuevo",
    details: "Ideas y contenido hacen florecer nuevas especies.",
    cues: ["Colores vivos", "Polinización luminosa", "Esculturas emergentes"],
  },
  {
    name: "Relaciones",
    visual: "Fuego",
    icon: Flame,
    status: "Encendido",
    details: "Conversaciones profundas avivan el fuego.",
    cues: ["Llamas altas", "Chispas sociales", "Calor estable"],
  },
  {
    name: "Casamiento",
    visual: "Constelación",
    icon: Orbit,
    status: "Aliniando",
    details: "Actos de cuidado conectan estrellas y abren nuevas rutas.",
    cues: ["Estrellas conectadas", "Órbitas sincronizadas", "Brillo nocturno"],
  },
]

export function RealmsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reinos vivos</CardTitle>
          <CardDescription>
            Cada área de vida es un organismo que crece o se degrada según tus acciones.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {realms.map((realm) => {
            const Icon = realm.icon
            return (
              <Card key={realm.name} className="border-emerald-500/20">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-emerald-300" />
                      <CardTitle>{realm.name}</CardTitle>
                    </div>
                    <Badge variant="approved">{realm.status}</Badge>
                  </div>
                  <CardDescription>{realm.visual} • {realm.details}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-2xl border border-emerald-500/10 bg-[#0b110d]/70 p-3 text-xs text-emerald-100/80">
                    Feedback visual:
                    <ul className="mt-2 space-y-1">
                      {realm.cues.map((cue) => (
                        <li key={cue}>• {cue}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between text-xs text-emerald-100/70">
                    <span>Estado emocional</span>
                    <span className="text-emerald-200">Estable</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-emerald-950">
                    <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-200" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Reglas de degradación</CardTitle>
            <CardDescription>La ausencia también tiene feedback visual.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-emerald-100/80">
            <p>• 3 días sin misión en un Reino = pérdida visual gradual.</p>
            <p>• 7 días sin misión = evento de alerta con cinemática gris.</p>
            <p>• Recuperación rápida si volvés con misión épica.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sinergias entre reinos</CardTitle>
            <CardDescription>Misiones combinadas generan bonus narrativos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-emerald-100/80">
            <p>• Cuerpo + Trabajo = “Modo productividad física” (+10% XP).</p>
            <p>• Relaciones + Casamiento = “Constelación intensa”.</p>
            <p>• Creatividad + Dinero = “Monetizar talento” (misiones premium).</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
