import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function LoginPage() {
  const nav = useNavigate()
  const [email, setEmail] = useState("")
  const [msg, setMsg] = useState<string | null>(null)

  function onMagicLink() {
    setMsg("Link mágico enviado. Revisá tu correo para ingresar.")
    setTimeout(() => nav("/dashboard"), 800)
  }

  return (
    <div className="min-h-screen bg-grid glow flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>LIFE:180</CardTitle>
          <CardDescription>Ingresá con Magic Link por email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {msg && <div className="text-sm text-emerald-200">{msg}</div>}
          <Button className="w-full" onClick={onMagicLink}>
            Enviar magic link
          </Button>
          <div className="text-xs text-emerald-100/60">
            Acceso sin contraseña. Ideal para una experiencia premium y rápida.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
