import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) setError(error.message)
  }

  async function onReset() {
    if (!email) return setError("Escribí tu email para enviar el reset.")
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })
    setLoading(false)
    if (error) setError(error.message)
    else setError("Te envié un email para resetear la contraseña.")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-xl">
        <h1 className="text-xl font-semibold">Licencias-TE</h1>
        <p className="text-sm text-white/70 mt-1">Ingresá con tu correo corporativo</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 outline-none"
            placeholder="correo@suizoargentina.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2 outline-none"
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="text-sm text-red-300">{error}</div>}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-white text-black font-medium py-2 disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={loading}
            className="w-full rounded-xl border border-white/15 py-2 text-sm text-white/80 hover:bg-white/5"
          >
            Olvidé mi contraseña
          </button>
        </form>
      </div>
    </div>
  )
}
