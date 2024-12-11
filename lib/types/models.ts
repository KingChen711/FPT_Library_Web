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
  address: string
}

export type Role = {
  englishName: string
  vietnameseName: string
  roleTypeIdx: number
}
