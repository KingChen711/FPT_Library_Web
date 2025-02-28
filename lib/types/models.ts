import {
  type EAuditType,
  type EBookCopyStatus,
  type EBookEditionStatus,
  type EBookFormat,
  type EFineType,
  type ENotificationType,
  type EResourceBookType,
  type ERoleType,
  type ESupplierType,
  type ETrackingStatus,
  type ETrackingType,
} from "./enums"

export type Audit = {
  auditTrailId: number
  email: string
  entityId: string
  entityName: string
  trailType: EAuditType
  dateUtc: string
  oldValues: object
  newValues: object
  changedColumns: string[]
}

export type Supplier = {
  supplierId: number
  supplierName: string
  supplierType: ESupplierType
  contactPerson: string | null
  contactEmail: string | null
  contactPhone: string | null
  address: string | null
  country: string | null
  city: string | null
  isDeleted: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date | null
}

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

export type CurrentUser = {
  userId: string
  roleId: number
  libraryCardId: string
  email: string
  firstName: string | null
  lastName: string | null
  passwordHash: null
  phone: string | null
  avatar: string | null
  address: string | null
  gender: "Male" | "Female" | "Other" | null
  dob: string | null
  isActive: boolean | null
  isDeleted: boolean | null
  isEmployeeCreated: boolean | null
  createDate: string | null
  modifiedDate: string | null
  modifiedBy: string | null
  twoFactorEnabled: boolean | null
  phoneNumberConfirmed: boolean | null
  emailConfirmed: boolean | null
  twoFactorSecretKey: boolean | null
  twoFactorBackupCodes: boolean | null
  phoneVerificationCode: boolean | null
  emailVerificationCode: boolean | null
  phoneVerificationExpiry: boolean | null
  role: Role
  libraryCard: {
    libraryCardId: string
    fullName: string | null
    avatar: string | null
    barcode: string | null
    issuanceMethod: number | null
    status: number | null
    isAllowBorrowMore: boolean | null
    maxItemOnceTime: number | null
    allowBorrowMoreReason: boolean | null
    totalMissedPickUp: number | null
    isReminderSent: boolean | null
    isExtended: boolean | null
    extensionCount: number | null
    issueDate: string | null
    expiryDate: string | null
    suspensionEndDate: string | null
    suspensionReason: string | null
    rejectReason: string | null
    isArchived: boolean | null
    archiveReason: string | null
    previousUserId: string | null
    transactionCode: string | null
    previousUser: null
  }
  notificationRecipients: []
}

export type LibraryItemLanguage = {
  languageName: string
  languageCode: string
}

export type ImportError = {
  rowNumber: number
  errors: string[]
}

export type Role = {
  roleId: number
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

export type LibraryCard = {
  libraryCardId: string
  fullName: string
  avatar: string
  barcode: string
  issuanceMethod: number
  status: number
  isAllowBorrowMore: boolean
  maxItemOnceTime: number
  totalMissedPickUp: number
  isReminderSent: boolean
  isExtended: boolean
  extensionCount: number
  issueDate: string
  expiryDate: string
  suspensionEndDate: string | null
  isArchived: boolean
  archiveReason: string | null
  previousUserId: string | null
  previousUser: string | null
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

export type Package = {
  libraryCardPackageId: number
  packageName: string
  price: number
  durationInMonths: number
  isActive: boolean
  createdAt: string
  description: string
}

export type PaymentMethod = {
  paymentMethodId: number
  methodName: string
}

export type LibraryItem = {
  libraryItemId: number
  title: string
  subTitle: string | null
  responsibility: string | null
  edition: string | null
  editionNumber: number | null
  language: string
  originLanguage: string | null
  summary: string | null
  coverImage: string | null
  publicationYear: number
  publisher: string | null
  publicationPlace: string | null
  classificationNumber: string
  cutterNumber: string
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
  categoryId: number
  shelfId: number | null
  status: number | null
  avgReviewedRate: number | null
  category: {
    categoryId: number
    prefix: string | null
    englishName: string | null
    vietnameseName: string | null
    description: string | null
    isAllowAITraining: boolean
  }
  shelf: {
    shelfId: number | null
    sectionId: number | null
    shelfNumber: string | null
    createDate: string | null
    updateDate: string | null
    isDeleted: boolean
    section: unknown
  } | null
  libraryItemInventory: {
    libraryItemId: number
    totalUnits: number
    availableUnits: number
    requestUnits: number
    borrowedUnits: number
    reservedUnits: number
  }
  authors: {
    authorId: number
    authorCode: string | null
    authorImage: string | null
    fullName: string | null
    biography: string | null
    dob: string | null
    dateOfDeath: string | null
    nationality: string | null
    createDate: string | null
    updateDate: string | null
    isDeleted: boolean
  }[]
  libraryItemInstances: {
    libraryItemInstanceId: number
    libraryItemId: number | null
    barcode: string | null
    status: EBookCopyStatus
    createdAt: string | null
    updatedAt: string | null
    createdBy: string | null
    updatedBy: string | null
    isDeleted: boolean
    libraryItemConditionHistories: unknown[]
  }[]
}

export type ReviewsLibraryItem = {
  reviewId: number
  libraryItemId: number
  userId: string
  ratingValue: number | null
  reviewText: string | null
  createDate: string | null
  updatedDate: string | null
  user: User
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
  libraryItemConditionHistories: (ConditionHistory & {
    condition: Condition
  })[]
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

export type Tracking = {
  trackingId: number
  supplierId: number
  receiptNumber: string
  totalItem: number
  totalAmount: number
  trackingType: ETrackingType
  transferLocation: string | null
  description: string | null
  status: ETrackingStatus
  expectedReturnDate: Date | null
  actualReturnDate: Date | null
  entryDate: Date
  createdAt: Date
  updatedAt: Date | null
  createdBy: string
  updatedBy: string | null
}

export type TrackingDetail = {
  trackingDetailId: number
  itemName: string
  itemTotal: number
  isbn: string | null
  unitPrice: number
  totalAmount: number
  reason: string | null
  trackingId: number
  libraryItemId: number | null
  categoryId: number
  conditionId: number
}

// Ocr Result
export type OcrResult = {
  fieldPointsWithThreshole: {
    name: string
    matchedPoint: number
    threshold: number
    isPassed: boolean
  }[]
  totalPoint: number
  confidenceThreshold: number
  imageName: string
}

export type PredictResult = {
  bestItem: {
    ocrResult: OcrResult
    libraryItemId: number
  }
  otherItems: {
    ocrResult: OcrResult
    libraryItemId: number
  }[]
}

// Ocr Detail
type LineStatisticDto = {
  lineValue: string
  matchedTitlePercentage: number
  matchedAuthorPercentage: number
  matchedPublisherPercentage: number
}

type StringComparison = {
  matchLine: string
  matchPhrasePoint: number
  fuzzinessPoint: number
  fieldThreshold: number
  propertyName: string
  matchPercentage: number
}

export type OcrDetail = {
  lineStatisticDtos: LineStatisticDto[]
  stringComparisions: StringComparison[]
  matchPercentage: number
  overallPercentage: number
}

// Ocr detect
export type DetectedValue = {
  name: string
  percentage: number
}

export type OcrDetect = {
  importImageDetected: DetectedValue[]
  currentItemDetected: DetectedValue[]
}

// Recommendation
export type LibraryItemsRecommendation = {
  itemDetailDto: LibraryItem
  matchedProperties: {
    name: string
    isMatched: boolean
  }[]
}

export type Condition = {
  conditionId: number
  englishName: string
  vietnameseName: string
}

export type ConditionHistory = {
  conditionHistoryId: number
  libraryItemInstanceId: number
  conditionId: number
  createdAt: Date
  updatedAt: Date | null
  createdBy: string
  updatedBy: string | null
}
