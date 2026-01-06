import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { supabase } from "@/lib/supabase"

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const location = useLocation()

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setHasSession(!!data.session)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-grid glow flex items-center justify-center p-6">
        <div className="text-sm text-slate-500">Cargando sesión…</div>
      </div>
    )
  }

  const isLogin = location.pathname === "/login"

  // Not signed in -> force login (but allow /login itself)
  if (!hasSession && !isLogin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  // Signed in and trying to access /login -> send to dashboard
  if (hasSession && isLogin) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
