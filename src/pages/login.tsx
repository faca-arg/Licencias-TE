import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import logo from "@/assets/suizo-argentina.png"

export function LoginPage() {
  const nav = useNavigate()
  const location = useLocation() as any
  const from = location?.state?.from || "/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function onLogin() {
    setLoading(true)
    setMsg(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setMsg(error.message)
    nav(from, { replace: true })
  }

  async function onReset() {
    if (!email) return setMsg("Escribí tu email para enviarte el link de cambio de contraseña.")
    setLoading(true)
    setMsg(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/login",
    })
    setLoading(false)
    if (error) return setMsg(error.message)
    setMsg("Listo. Revisá tu correo para cambiar la contraseña.")
  }

  return (
    <div className="min-h-screen bg-grid glow flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-2 flex justify-center">
            <img
              src={logo}
              alt="Suizo Argentina"
              className="h-10 w-auto object-contain"
            />
          </div>
          <CardTitle>Ingresar</CardTitle>
          <CardDescription>Acceso con Supabase (correo + contraseña)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="correo@suizoargentina.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {msg && <div className="text-sm text-amber-600">{msg}</div>}
          <Button className="w-full" disabled={loading} onClick={onLogin}>
            {loading ? "Ingresando..." : "Entrar"}
          </Button>
          <Button variant="outline" className="w-full" disabled={loading} onClick={onReset}>
            Olvidé mi contraseña
          </Button>
          <div className="text-xs text-slate-500">
            Tip: en Supabase, Authentication → Users, creás los usuarios y les asignás una contraseña temporal.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
