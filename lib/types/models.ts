import { type ERoleType } from "./enums"

export type User = {
  userId: string
  userCode: string | null
  email: string | null
  passwordHash: string | null
  firstName: string
  lastName: string
  dob: string | null
  phone: string | null
  avatar: string | null
  address: string | null
  gender: string | null
  isActive: boolean
  isDeleted: boolean
  createDate: string
  modifiedDate: string | null
  modifiedBy: string | null
  twoFactorEnabled: boolean
  phoneNumberConfirmed: boolean
  emailConfirmed: boolean
  twoFactorSecretKey: string | null
  twoFactorBackupCodes: string | null
  phoneVerificationCode: string | null
  emailVerificationCode: string | null
  phoneVerificationExpiry: string | null
  roleId: number
  role: {
    roleId: number
    vietnameseName: string
    englishName: string
    roleType: ERoleType
    rolePermissions: []
  }
}

export type Role = {
  englishName: string
  vietnameseName: string
  roleType: ERoleType
}

export type Employee = {
  employeeId: string | null
  employeeCode: string | null
  email: string | null
  passwordHash: string | null
  firstName: string | null
  lastName: string | null
  dob: string | null
  phone: string | null
  avatar: string | null
  address: string | null
  gender: "Male" | "Female" | null
  hireDate: string | null
  terminationDate: string | null
  isActive: boolean | null
  isDeleted: boolean | null
  createDate: string | null
  modifiedDate: string | null
  modifiedBy: string | null
  twoFactorEnabled: boolean | null
  phoneNumberConfirmed: boolean | null
  emailConfirmed: boolean | null
  twoFactorSecretKey: string | null
  twoFactorBackupCodes: string | null
  phoneVerificationCode: string | null
  emailVerificationCode: string | null
  phoneVerificationExpiry: string | null
  roleId: number
  role: {
    roleId: number
    vietnameseName: string
    englishName: string
    roleType: ERoleType
    rolePermissions: []
  }
}
