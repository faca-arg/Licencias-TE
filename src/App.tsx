import { Routes, Route, Navigate } from "react-router-dom"
import { AppShell } from "@/components/layout/app-shell"
import { DashboardPage } from "@/pages/dashboard"
import { CalendarPage } from "@/pages/calendar"
import { RealmsPage } from "@/pages/realms"
import { MissionsPage } from "@/pages/missions"
import { BlueprintPage } from "@/pages/blueprint"
import { RoadmapPage } from "@/pages/roadmap"
import { LoginPage } from "@/pages/login"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="realms" element={<RealmsPage />} />
        <Route path="missions" element={<MissionsPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="blueprint" element={<BlueprintPage />} />
        <Route path="roadmap" element={<RoadmapPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
