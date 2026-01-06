export type Role = "admin" | "manager" | "employee"

export type Employee = {
  id: string
  legajo: string
  firstName: string
  lastName: string
  position: string
  area: string
  startDate: string // ISO
  active: boolean
  managerId?: string
  balance: {
    year: number
    pendingCurrent: number
    pendingPrevious: number
    used: number
  }
}

export type VacationStatus = "approved" | "pending" | "rejected" | "canceled"

export type VacationRequest = {
  id: string
  employeeId: string
  startDate: string // ISO
  endDate: string // ISO (inclusive)
  requestedDays: number
  status: VacationStatus
  createdAt: string // ISO
  comment?: string
}

export type HomeOfficeStatus = "approved" | "pending" | "rejected" | "canceled"

export type HomeOfficeRequest = {
  id: string
  employeeId: string
  date: string // ISO YYYY-MM-DD
  status: HomeOfficeStatus
  createdAt: string // ISO
}
