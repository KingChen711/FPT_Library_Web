import {
  type EAuditType,
  type EBookCopyStatus,
  type EBookEditionStatus,
  type EBookFormat,
  type EBorrowDigitalStatus,
  type EBorrowRecordStatus,
  type EBorrowRequestStatus,
  type EBorrowType,
  type ECardStatus,
  type EFineBorrowStatus,
  type EFineType,
  type EGender,
  type EIssuanceMethod,
  type ENotificationType,
  type EReservationQueueStatus,
  type EResourceBookType,
  type ERoleType,
  type EStockTransactionType,
  type ESupplierType,
  type ETrackingStatus,
  type ETrackingType,
  type ETrainingStatus,
  type ETransactionMethod,
  type ETransactionStatus,
  type ETransactionType,
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
  gender: EGender
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

export type LibraryItemLanguage = { languageName: string; languageCode: string }

export type ImportError = { rowNumber: number; errors: string[] }

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
  gender: EGender
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

export type BorrowSettings = {
  pickUpExpirationInDays: number
  extendPickUpInDays: number
  borrowAmountOnceTime: number
  totalMissedPickUpAllow: number
  endSuspensionInDays: number
  maxBorrowExtension: number
  allowToExtendInDays: number
  totalBorrowExtensionInDays: number
  overdueOrLostHandleInDays: number
  fineExpirationInDays: number
  lostAmountPercentagePerDay: number
}

export type LibraryCardHolder = {
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
  authorImage: string | null
  biography: string | null
  dob: Date | null
  dateOfDeath: Date | null
  nationality: string | null
  createDate: Date
  updateDate: Date
  isDeleted: boolean
}

export type PaymentMethod = { paymentMethodId: number; methodName: string }

export type PaymentData = {
  description: string
  orderCode: string
  qrCode: string
  expiredAt: Date | null
  paymentLinkId: string
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
  category: Category
  shelf: Shelf | null
  libraryItemInventory: LibraryItemInventory
  resources: BookResource[]
  authors: Author[]
  libraryItemInstances: LibraryItemInstance[]
  digitalBorrows: DigitalBorrow[]
}

export type DigitalBorrow = {
  digitalBorrowId: number
  resourceId: number
  userId: string
  registerDate: string
  expiryDate: string
  isExtended: boolean
  extensionCount: number
  status: EBorrowDigitalStatus
  user: null
  digitalBorrowExtensionHistories: unknown[]
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
}

export type Fine =
  | {
      finePolicyId: number
      finePolicyTitle: string
      conditionType: EFineType.DAMAGE
      description: string
      minDamagePct: number
      maxDamagePct: number
      processingFee: number
      dailyRate: null
      chargePct: number
    }
  | {
      finePolicyId: number
      finePolicyTitle: string
      conditionType: EFineType.LOST
      description: string
      minDamagePct: null
      maxDamagePct: null
      processingFee: number
      dailyRate: null
      chargePct: number
    }
  | {
      finePolicyId: number
      finePolicyTitle: string
      conditionType: EFineType.OVER_DUE
      description: string
      minDamagePct: null
      maxDamagePct: null
      processingFee: null
      dailyRate: number
      chargePct: null
    }

export type ClosureDay = {
  closureDayId: number
  day: number
  month: number
  year: number | null
  vieDescription: string
  engDescription: string
}

export type FineBorrow = {
  fineId: number
  borrowRecordDetailId: number
  finePolicyId: number
  fineAmount: number
  fineNote: string | null
  status: EFineBorrowStatus
  createdAt: Date
  expiryAt: Date
  createdBy: string
}

export type Category = {
  categoryId: number
  prefix: string
  englishName: string
  vietnameseName: string
  description: string | null
  isAllowAITraining: boolean
  totalBorrowDays: number | null
}

export type SupplementRequestDetail = {
  supplementRequestDetailId: number
  title: string
  author: string | null
  publisher: string | null
  publishedDate: string | null
  description: string | null
  isbn: string | null
  pageCount: number | null
  estimatedPrice: number | null
  dimensions: number | null
  categories: string | null
  averageRating: number | null
  ratingsCount: number | null
  coverImageLink: string | null
  language: string | null
  previewLink: string | null
  infoLink: string | null
  supplementRequestReason: string | null
  relatedLibraryItemId: number
  trackingId: number
}

export type BorrowDigital = {
  digitalBorrowId: number
  resourceId: number
  userId: string
  registerDate: Date
  expiryDate: Date
  isExtended: boolean
  extensionCount: number
  status: EBorrowDigitalStatus
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
  s3OriginalName: string | null
}

export type LibraryItemInventory = {
  libraryItemId: number
  totalUnits: number
  availableUnits: number
  requestUnits: number
  borrowedUnits: number
  reservedUnits: number
  lostUnits: number
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
  isCirculated: boolean
  libraryItemConditionHistories: (ConditionHistory & { condition: Condition })[]
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
  engZoneName: string
  vieZoneName: string
  engDescription: string | null
  vieDescription: string | null
  totalCount: number
  createDate: Date
  updateDate: null
  isDeleted: false
}

export type Section = {
  sectionId: number
  zoneId: number
  engSectionName: string
  vieSectionName: string
  shelfPrefix: string
  classificationNumberRangeFrom: number
  classificationNumberRangeTo: number
  createDate: Date
  updateDate: Date | null
  isDeleted: boolean
  isChildrenSection: boolean
  isReferenceSection: boolean
  isJournalSection: boolean
}

export type Shelf = {
  shelfId: number
  sectionId: number
  shelfNumber: string
  engShelfName: string
  vieShelfName: string
  classificationNumberRangeFrom: number
  classificationNumberRangeTo: number
  createDate: Date
  updateDate: Date | null
  isDeleted: boolean
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
  dataFinalizationDate: Date | null
  createdBy: string
  updatedBy: string | null
}

export type WarehouseTrackingInventory = {
  trackingId: number
  totalItem: number
  totalInstanceItem: number
  totalCatalogedItem: number
  totalCatalogedInstanceItem: number
}

export type TrackingDetail = {
  trackingDetailId: number
  itemName: string
  itemTotal: number
  isbn: string | null
  unitPrice: number
  totalAmount: number
  trackingId: number
  libraryItemId: number | null
  categoryId: number
  conditionId: number
  stockTransactionType: EStockTransactionType
  createdAt: Date
  updatedAt: Date | null
  createdBy: string
  updatedBy: string | null
  barcodeRangeFrom: string
  barcodeRangeTo: string
  hasGlueBarcode: boolean
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
  bestItem: { ocrResult: OcrResult; libraryItemId: number }
  otherItems: { ocrResult: OcrResult; libraryItemId: number }[]
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
export type DetectedValue = { name: string; percentage: number }

export type OcrDetect = {
  importImageDetected: DetectedValue[]
  currentItemDetected: DetectedValue[]
}

// Recommendation
export type LibraryItemsRecommendation = {
  itemDetailDto: LibraryItem
  matchedProperties: { name: string; isMatched: boolean }[]
}

// Payment

export type LibraryCardTransaction = {
  code: string
  desc: string
  data: {
    bin: string
    accountNumber: string
    accountName: string
    amount: number
    description: string
    orderCode: string
    curency: string
    paymentLinkId: string
    status: string
    checkoutUrl: string
    qrCode: string
  }
  signature: string
}

// end Payment

export type Condition = {
  conditionId: number
  englishName: string
  vietnameseName: string
}

export type TrainSession = {
  trainingSessionId: number
  model: number
  totalTrainedItem: number
  totalTrainedTime: number | null
  trainingStatus: ETrainingStatus
  errorMessage: string | null
  trainingPercentage: number
  trainDate: Date
  trainBy: string
}

export type TrainDetail = {
  trainingDetailId: number
  trainingSessionId: number
  libraryItemId: number
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

export type Patron = {
  userId: string
  roleId: number
  libraryCardId: number | null

  email: string
  avatar: string | null
  firstName: string | null
  lastName: string | null
  phone: string | null
  dob: Date | null
  gender: EGender | null
  address: string | null

  isActive: boolean
  isDeleted: boolean

  isEmployeeCreated: boolean

  createDate: Date
  modifiedDate: Date | null
  modifiedBy: string | null
}

export type Package = {
  libraryCardPackageId: number
  packageName: string
  price: number
  durationInMonths: number
  isActive: boolean
  createdAt: Date
  description: string | null
}

export type LibraryCard = {
  libraryCardId: string
  fullName: string
  avatar: string
  barcode: string
  issuanceMethod: EIssuanceMethod
  status: ECardStatus
  isAllowBorrowMore: boolean
  maxItemOnceTime: number
  allowBorrowMoreReason: string | null
  totalMissedPickUp: number
  isReminderSent: boolean
  isExtended: boolean
  extensionCount: number
  issueDate: Date
  expiryDate: Date
  suspensionEndDate: Date | null
  suspensionReason: string | null
  rejectReason: string | null
  isArchived: boolean
  archiveReason: string | null
  previousUserId: string | null
  transactionCode: string
}

export type BorrowItem = DigitalBorrow & {
  libraryResource: BookResource
  transactions: unknown[]
}

export type Transaction = {
  transactionId: number
  transactionCode: string
  userId: string
  amount: number
  transactionStatus: ETransactionStatus
  transactionType: ETransactionType
  transactionMethod: ETransactionMethod
  description: string | null
  transactionDate: Date | null
  qrCode: string | null
  expiredAt: Date | null
  createdAt: Date
  createdBy: string
  cancelledAt: Date | null
  cancellationReason: string | null
  paymentLinkId: string | null
  fineId: number | null
  resourceId: number | null
  libraryCardPackageId: number | null

  paymentMethodId: number | null
}

export type BorrowRequest = {
  borrowRequestId: number
  libraryCardId: string
  requestDate: Date
  expirationDate: Date | null
  status: EBorrowRequestStatus
  description: string | null
  cancelledAt: string | null
  cancellationReason: string | null
  isReminderSent: boolean
  totalRequestItem: number
  libraryItems: LibraryItem[]
  reservationQueues: ReservationQueue[]
}

export type BorrowRequestResource = {
  borrowRequestResourceId: number
  borrowRequestId: number
  resourceId: number
  resourceTitle: string
  borrowPrice: number
  defaultBorrowDurationDays: number
  transactionId: number | null
  libraryResource: BookResource
}

export type ReservationQueue = {
  queueId: number
  libraryItemId: number
  libraryItemInstanceId: number | null
  libraryCardId: string
  queueStatus: EReservationQueueStatus
  borrowRequestId: number | null
  isReservedAfterRequestFailed: boolean
  expectedAvailableDateMin: Date | null
  expectedAvailableDateMax: Date | null
  reservationDate: Date
  assignedDate: Date | null
  expiryDate: Date | null
  collectedDate: Date | null
  isNotified: boolean
  cancelledBy: string | null
  cancellationReason: string | null
  totalExtendPickup: number
  reservationCode: string | null
  isAppliedLabel: boolean
  isAssignable: boolean

  libraryItem: LibraryItem
  libraryItemInstance: null | LibraryItemInstance
  libraryCard: LibraryCard
  borrowRequest: BorrowRequest
}

export type DigitalTransaction = Transaction & {
  qrCode: string
}

export type BorrowRequestManagement = {
  borrowRequestId: number
  libraryCardId: string
  requestDate: Date
  expirationDate: Date | null
  status: EBorrowRequestStatus
  description: string | null
  cancelledAt: string | null
  cancellationReason: string | null
  isReminderSent: boolean
  isExistPendingResources: boolean
  totalRequestItem: number
}

export type BorrowRecord = {
  borrowRecordId: number
  borrowRequestId: number
  libraryCardId: string
  borrowDate: Date
  borrowType: EBorrowType
  selfServiceBorrow: boolean
  selfServiceReturn: boolean
  hasFineToPayment: boolean
  totalRecordItem: number
  processedBy: string
}

export type BorrowRecordDetail = {
  borrowRecordDetailId: number
  borrowRecordId: number
  libraryItemInstanceId: number
  conditionId: number
  returnConditionId: number | null
  conditionCheckDate: Date | null
  returnDate: Date | null
  dueDate: Date
  status: EBorrowRecordStatus
  isReminderSent: boolean
  totalExtension: number
}

export type ReservationQueueManagement = {
  queueId: number
  libraryItemId: number
  libraryItemInstanceId: number | null
  libraryCardId: string
  queueStatus: EReservationQueueStatus
  borrowRequestId: number | null
  isReservedAfterRequestFailed: boolean
  expectedAvailableDateMin: Date | null
  expectedAvailableDateMax: Date | null
  reservationDate: Date
  assignedDate: Date | null
  expiryDate: Date | null
  collectedDate: Date | null
  isNotified: boolean
  cancelledBy: string | null
  cancellationReason: string | null
  totalExtendPickup: number
  reservationCode: string | null
  isAppliedLabel: boolean
  isAssignable: boolean
}

export type StockRecommendedBook = {
  id: string
  title: string
  author: string
  publisher: string
  publishedDate?: string
  description?: string
  selfLink?: string
  isbn?: string
  pageCount?: number
  estimatedPrice?: number // Giá có lúc có lúc không trong GG API, nên có thể lúc demo mình lấy giá của quyển related giá ước chừng
  dimensions?: string
  categories?: string
  language?: string
  averageRating?: number // Để null nếu kh cóF
  ratingsCount?: number // Để null nếu kh có
  // imageLinks -> thumbnail. Hình trên API rất nhỏ chỉ tầm 130 x 200 -> Có thể FE tự động tăng size khi get detail sau
  coverImageLink?: string
  previewLink?: string
  infoLink?: string
  // Cái này cực quan trọng. Nó xác định xem cái item mà GG recommend là cho tài liệu nào đã có sẵn trên hệ thống
  // Nên bắt đầu trước từ warehouseTrackingDetails -> sau đó lấy đc các item mà có data cho là nên nhập thêm -> sau đó mới gọi recommend cho các cuốn đó
  // Theo flow từ trên xuống, 1 WH detail - tức 1 item thì có thể có nhiều supplementRequestDetails (nhiều itemId trùng)
  relatedLibraryItemId: number
}

export type SupplementRequest = {
  trackingId: 3
  supplierId: null
  receiptNumber: "PN7982994"
  totalItem: 5
  totalAmount: 1390000.0
  trackingType: 1
  transferLocation: null
  description: null
  status: 0
  expectedReturnDate: null
  actualReturnDate: null
  entryDate: "2025-04-09T00:00:00"
  dataFinalizationDate: "2025-04-09T00:00:00"
  createdAt: "2025-04-09T06:26:41.14"
  updatedAt: null
  createdBy: "librarian@gmail.com"
  updatedBy: null
  warehouseTrackingInventory: WarehouseTrackingInventory
}
