import { Routes, Route, Navigate } from "react-router-dom"
import { AppShell } from "@/components/layout/app-shell"
import { DashboardPage } from "@/pages/dashboard"
import { EmployeesPage } from "@/pages/employees"
import { RequestsPage } from "@/pages/requests"
import { SettingsPage } from "@/pages/settings"
import { HomeOfficePage } from "@/pages/home-office"
import { LoginPage } from "@/pages/login"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="home-office" element={<HomeOfficePage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
