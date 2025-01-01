import {
  type EBookFormat,
  type ENotificationType,
  type EResourceBookType,
  type ERoleType,
} from "./enums"

export type User = {
  userId: string
  userCode: string
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  dob: string
  phone: string
  avatar: string
  address: string
  gender: "Male" | "Female" | "Other"
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
  employeeId: string
  employeeCode: string
  email: string
  passwordHash: string | null
  firstName: string
  lastName: string
  dob: string
  phone: string
  avatar: string
  address: string
  gender: "Male" | "Female"
  hireDate: string
  terminationDate: string
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

export type Author = {
  authorId: number
  authorCode: string
  authorImage: string
  fullName: string
  biography: string
  dob: string
  dateOfDeath: string
  nationality: string
  createDate: string
  updateDate: string
  isDeleted: false
  bookEditionAuthors: unknown[]
}

export type Notification = {
  notificationId: number
  title: string
  message: string
  isPublic: boolean
  createDate: Date
  createdBy: string
  notificationType: ENotificationType
  notificationRecipients: []
}

export type Fine = {
  finePolicyId: number
  conditionType: string
  fineAmountPerDay: number
  fixedFineAmount: number
  description: string | null
}

export type Category = {
  categoryId: number
  englishName: string
  vietnameseName: string
  description: string | null
}

export type BookEdition = {
  bookId: number
  bookEditionId: number
  editionNumber: number
  publicationYear: number
  pageCount: number
  totalCopies?: number
  availableCopies?: number
  requestCopies?: number
  reservedCopies?: number
  author: string
  summary: string | null
  editionSummary: string | null
  title: string
  editionTitle: string
  subTitle: string
  shelf: string | null
  format: EBookFormat | null //TODO
  isbn: string
  language: string
  coverImage: string | null
  publisher: string | null
  createBy: string
  canBorrow: boolean
  createdAt: Date
  updatedAt: Date | null
  estimatedPrice: number
}

export type Book = {
  bookId: number
  title: string
  subTitle: string | null
  summary: string
  isDeleted: boolean
  isDraft: boolean
  bookCodeForAITraining: string | null
  isTrained: boolean
}

export type BookResource = {
  resourceId: number
  bookId: number
  resourceType: EResourceBookType
  resourceUrl: string
  resourceSize: number
  fileFormat: EBookFormat
  provider: "Cloudinary"
  providerPublicId: string
  providerMetadata: string | null
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date | null
  createdBy: string
  updatedBy: string | null
}

export type BookEditionInventory = {
  bookEditionId: number
  totalCopies: number
  availableCopies: number
  requestCopies: number
  reservedCopies: number
}

export type BookEditionCopy = {
  bookEditionCopyId: number
  bookEditionId: number
  code: string
  status: "Out Of Shelf"
  createdAt: Date
  updatedAt: Date | null
  createdBy: string
  updatedBy: string | null
  isDeleted: boolean
}
