import {
  type EBookCopyStatus,
  type EBookEditionStatus,
  type EBookFormat,
  type EFineType,
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

export type ImportError = {
  rowNumber: number
  errors: string[]
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

export type LibraryItemAuthor = {
  libraryItemAuthorId: number
  libraryItemId: number
  authorId: number
  createdAt: Date
  updatedAt: Date | null
  createdBy: string | null
  updatedBy: string | null
}

export type Author = {
  authorId: number
  fullName: string
  authorCode: string
  authorImage: string
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
  finePolicyTitle: string
  conditionType: EFineType
  fineAmountPerDay: number
  fixedFineAmount: number
  description: string | null
}

export type Category = {
  categoryId: number
  prefix: string
  englishName: string
  vietnameseName: string
  description: string | null
  isAllowAITraining: boolean
  //TODO: check isAllowAITraining in create book form
}

export type BookEdition = {
  libraryItemId: number
  title: string
  subTitle: string | null
  responsibility: string | null
  edition: string | null
  editionNumber: number | null
  language: string | null
  originLanguage: string | null
  summary: string | null
  coverImage: string | null
  publicationYear: number | null
  publisher: string | null
  publicationPlace: string | null
  classificationNumber: string | null
  cutterNumber: string | null
  isbn: string | null
  ean: string | null
  estimatedPrice: number | null
  pageCount: number | null
  physicalDetails: string | null
  dimensions: string | null
  accompanyingMaterial: string | null
  genres: string | null
  generalNote: string | null
  bibliographicalNote: string | null
  topicalTerms: string | null
  additionalAuthors: string | null
  avgReviewedRate: number | null
  categoryId: number
  shelfId: number | null
  groupId: number | null
  status: EBookEditionStatus
  isDeleted: boolean
  canBorrow: boolean
  isTrained: boolean
  trainedAt: Date | null
  createdAt: Date
  updatedAt: Date | null
  createdBy: string
  updatedBy: string | null
}

export type BookResource = {
  resourceId: number
  resourceTitle: string
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
  defaultBorrowDurationDays: number | null
  borrowPrice: number | null
}

export type LibraryItemInventory = {
  libraryItemId: number
  totalUnits: number
  availableUnits: number
  requestUnits: number
  borrowedUnits: number
  reservedUnits: number
}

export type LibraryItemInstance = {
  libraryItemInstanceId: number
  libraryItemId: number
  barcode: string
  status: EBookCopyStatus
  createdAt: Date
  updatedAt: Date | null
  createdBy: string
  updatedBy: string | null
  isDeleted: boolean
}

export type Floor = {
  floorId: number
  floorNumber: string
  createDate: Date
  updateDate: Date | null
  isDeleted: boolean
}

export type Zone = {
  zoneId: number
  floorId: number
  zoneName: string
  xCoordinate: number
  yCoordinate: number
  createDate: Date
  updateDate: Date | null
  isDeleted: boolean
}

export type Section = {
  sectionId: number
  zoneId: number
  sectionName: string
  createDate: Date
  updateDate: Date | null
  isDeleted: boolean
}

export type Shelf = {
  shelfId: number
  sectionId: number
  shelfNumber: string
  createDate: Date
  updateDate: Date | null
  isDeleted: boolean
  section: Section | null
}

export type LibraryItemGroup = {
  groupId: number
  aiTrainingCode: string
  classificationNumber: string | null
  cutterNumber: string | null
  title: string
  subTitle: string | null
  author: string | null
  topicalTerms: string | null
  trainedAt: Date | null
  createdAt: Date
  updatedAt: Date | null
  createdBy: string
  updatedBy: string
}
