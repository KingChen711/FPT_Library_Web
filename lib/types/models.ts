import { type ERole } from "./enums"

export type User = {
  userId: string
  email: string
  firstName: string
  lastName: string
  dob: string
  phone: string
  avatar: string
  isActive: boolean
  gender: string
  role: string // User, Employee
}

export type Role = {
  roleName: ERole
}
