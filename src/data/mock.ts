import type { Employee, VacationRequest } from './models'

export const mockEmployees: Employee[] = [
  {
    "id": "e1",
    "legajo": "1001",
    "firstName": "Camila",
    "lastName": "Pérez",
    "position": "Analista",
    "area": "Comercial",
    "startDate": "2021-06-14",
    "active": true,
    "managerId": "e6",
    "balance": {
      "year": 2026,
      "pendingCurrent": 14,
      "pendingPrevious": 3,
      "used": 0
    }
  },
  {
    "id": "e2",
    "legajo": "1002",
    "firstName": "Tomás",
    "lastName": "Gómez",
    "position": "Operaciones",
    "area": "Logística",
    "startDate": "2019-02-01",
    "active": true,
    "managerId": "e7",
    "balance": {
      "year": 2026,
      "pendingCurrent": 10,
      "pendingPrevious": 0,
      "used": 4
    }
  },
  {
    "id": "e3",
    "legajo": "1003",
    "firstName": "Lucía",
    "lastName": "Martínez",
    "position": "RRHH",
    "area": "Administración",
    "startDate": "2022-09-05",
    "active": true,
    "managerId": "e6",
    "balance": {
      "year": 2026,
      "pendingCurrent": 12,
      "pendingPrevious": 5,
      "used": 0
    }
  },
  {
    "id": "e4",
    "legajo": "1004",
    "firstName": "Nicolás",
    "lastName": "Suárez",
    "position": "Analista",
    "area": "Finanzas",
    "startDate": "2020-01-10",
    "active": true,
    "managerId": "e6",
    "balance": {
      "year": 2026,
      "pendingCurrent": 8,
      "pendingPrevious": 2,
      "used": 5
    }
  },
  {
    "id": "e5",
    "legajo": "1005",
    "firstName": "Valentina",
    "lastName": "Rossi",
    "position": "Soporte",
    "area": "IT",
    "startDate": "2023-04-18",
    "active": true,
    "managerId": "e8",
    "balance": {
      "year": 2026,
      "pendingCurrent": 15,
      "pendingPrevious": 0,
      "used": 0
    }
  },
  {
    "id": "e6",
    "legajo": "2001",
    "firstName": "Mariano",
    "lastName": "López",
    "position": "Jefe",
    "area": "Administración",
    "startDate": "2017-07-03",
    "active": true,
    "balance": {
      "year": 2026,
      "pendingCurrent": 20,
      "pendingPrevious": 0,
      "used": 0
    }
  },
  {
    "id": "e7",
    "legajo": "2002",
    "firstName": "Sofía",
    "lastName": "Benítez",
    "position": "Jefa",
    "area": "Logística",
    "startDate": "2018-11-12",
    "active": true,
    "balance": {
      "year": 2026,
      "pendingCurrent": 18,
      "pendingPrevious": 1,
      "used": 0
    }
  },
  {
    "id": "e8",
    "legajo": "2003",
    "firstName": "Diego",
    "lastName": "Fernández",
    "position": "Jefe",
    "area": "IT",
    "startDate": "2016-03-22",
    "active": true,
    "balance": {
      "year": 2026,
      "pendingCurrent": 22,
      "pendingPrevious": 0,
      "used": 0
    }
  }
] as any;

export const mockRequests: VacationRequest[] = [
  {
    "id": "r1",
    "employeeId": "e2",
    "startDate": "2026-01-03",
    "endDate": "2026-01-08",
    "requestedDays": 5,
    "status": "approved",
    "createdAt": "2025-12-16"
  },
  {
    "id": "r2",
    "employeeId": "e1",
    "startDate": "2026-01-12",
    "endDate": "2026-01-17",
    "requestedDays": 6,
    "status": "pending",
    "createdAt": "2026-01-03",
    "comment": "Viaje familiar"
  },
  {
    "id": "r3",
    "employeeId": "e5",
    "startDate": "2025-12-24",
    "endDate": "2025-12-29",
    "requestedDays": 6,
    "status": "approved",
    "createdAt": "2025-11-26"
  },
  {
    "id": "r4",
    "employeeId": "e3",
    "startDate": "2026-01-06",
    "endDate": "2026-01-07",
    "requestedDays": 2,
    "status": "approved",
    "createdAt": "2025-12-26"
  },
  {
    "id": "r5",
    "employeeId": "e4",
    "startDate": "2026-01-20",
    "endDate": "2026-01-23",
    "requestedDays": 4,
    "status": "approved",
    "createdAt": "2025-12-31"
  }
] as any;
