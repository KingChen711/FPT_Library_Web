export enum ERoleType {
  USER = "User",
  EMPLOYEE = "Employee",
}

export enum EAuditType {
  NONE,
  ADDED,
  MODIFIED,
  DELETED,
}

export enum EPatronType {
  SELF_MADE,
  EMPLOYEE_MADE,
}

export enum ETransactionMethod {
  CASH,
  DIGITAL_PAYMENT,
}

export enum EPatronHasCard {
  HAVE_CARD,
  NO_CARD,
}

export enum ResourceType {
  Profile = "Profile",
  BookImage = "BookImage",
  BookAudio = "BookAudio",
}

export enum ECardStatus {
  UNPAID,
  PENDING,
  ACTIVE,
  REJECTED,
  EXPIRED,
  SUSPENDED,
}

export enum EIssuanceMethod {
  IN_LIBRARY,
  ONLINE,
}

export enum EGender {
  MALE = "Male",
  FEMALE = "Female",
}

export enum EIdxGender {
  MALE,
  FEMALE,
  OTHER,
}

export enum EPatronStatus {
  ACTIVE,
  INACTIVE,
  DELETED, //client only
}

export const ERoleTypeToIndex: Map<ERoleType, number> = new Map([
  [ERoleType.USER, 0],
  [ERoleType.EMPLOYEE, 1],
])

export const IndexToERoleType: Map<number, ERoleType> = new Map([
  [0, ERoleType.USER],
  [1, ERoleType.EMPLOYEE],
])

export interface Route {
  feature?: EFeature
  route: string
  label: string
  Icon?: React.ComponentType
  subRoutes?: Omit<Route, "feature">[]
}

export enum ESystemRoutes {
  // Management
  MANAGEMENT = "/management",

  // User management
  USER_MANAGEMENT = "/management/users",

  // Account
  ACCOUNT_MANAGEMENT = "/me/account",
  PROFILE_MANAGEMENT = "/me/account/profile",
  LIBRARY_CARD_MANAGEMENT = "/me/account/library-card",
  BORROW_MANAGEMENT = "/me/account/borrow",
  RETURN_MANAGEMENT = "/me/account/return",
  RESERVATION_MANAGEMENT = "/me/account/reservation",
  TRANSACTION_MANAGEMENT = "/me/account/transaction",
  SECURITY_MANAGEMENT = "/me/account/security",
  INTERFACE_MANAGEMENT = "/me/account/interface",
  NOTIFICATION_MANAGEMENT = "/me/account/notifications",
}

export enum EFeature {
  DASHBOARD_MANAGEMENT = 99,
  USER_MANAGEMENT = 1,
  EMPLOYEE_MANAGEMENT = 2,
  ROLE_MANAGEMENT = 3,
  FINE_MANAGEMENT = 4,
  LIBRARY_ITEM_MANAGEMENT = 5,
  WAREHOUSE_TRACKING_MANAGEMENT = 6,
  BORROW_MANAGEMENT = 7,
  TRANSACTION_MANAGEMENT = 8,
  SYSTEM_CONFIGURATION_MANAGEMENT = 9,
  SYSTEM_HEALTH_MANAGEMENT = 10,
}

export enum ESupplierType {
  PUBLISHER,
  DISTRIBUTOR,
}

export enum ETrackingType {
  STOCK_IN,
  SUPPLEMENT_REQUEST,
  STOCK_CHECKING,
  STOCK_OUT,
}

export enum ETrackingStatus {
  PROCESSING,
  COMPLETED,
  CANCELLED,
}

export enum EAccessLevel {
  ACCESS_DENIED = 0,
  VIEW = 1,
  MODIFY = 2,
  CREATE = 3,
  FULL_ACCESS = 4,
}

export enum ENotificationType {
  EVENT,
  REMINDER,
  NOTICE,
}

export enum EResourceBookType {
  AUDIO_BOOK = "AudioBook",
  EBOOK = "Ebook",
}

export enum EBookFormat {
  PAPERBACK = "Paperback",
  HARD_COVER = "HardCover",
}

export enum EBookCopyConditionStatus {
  GOOD = "Good",
  WORN = "Worn",
  DAMAGED = "Damaged",
  // LOST = "Lost",
}

export enum ELibraryItemStatus {
  Draft = "Draft",
  Published = "Published",
}

export enum EVisibility {
  PUBLIC = "Public",
  PRIVATE = "Private",
}

export enum EBookEditionStatus {
  DRAFT = 0,
  PUBLISHED = 1,
  DELETED = 2, //client only
}

export enum EBookCopyStatus {
  IN_SHELF = "InShelf",
  OUT_OF_SHELF = "OutOfShelf",
  BORROWED = "Borrowed",
  RESERVED = "Reserved",
  LOST = "Lost",
  DELETED = "Deleted",
}

export enum EFineType {
  OVER_DUE,
  LOST,
  DAMAGE,
}

export enum EDuplicateHandle {
  ALLOW = "Allow",
  REPLACE = "Replace",
  SKIP = "Skip",
}

export enum EFineBorrowStatus {
  PENDING,
  PAID,
  EXPIRED,
}

export const EDuplicateHandleToIndex: Map<EDuplicateHandle, number> = new Map([
  [EDuplicateHandle.ALLOW, 0],
  [EDuplicateHandle.REPLACE, 1],
  [EDuplicateHandle.SKIP, 2],
])

export enum ESearchType {
  QUICK_SEARCH,
  BASIC_SEARCH,
  ADVANCED_SEARCH,
}

export enum EGroupCheckType {
  AbleToForceGrouped = 1,
  GroupSuccess = 2,
  GroupFailed = 3,
}

export enum ETransactionStatus {
  PENDING,
  EXPIRED,
  PAID,
  CANCELLED,
}

export enum EBorrowRequestStatus {
  CREATED, // The request is created and waiting for the user to pick up the item
  EXPIRED, // The user didn't pick up the item before ExpirationDate
  BORROWED, // The user picked up the item, and a BorrowRecord has been created
  CANCELLED, // The user cancels the request
}

export enum ETransactionType {
  FINE, // [Description("Phí phạt")]

  DIGITAL_BORROW, // [Description("Mượn tài liệu điện tử")]

  LIBRARY_CARD_REGISTER, // [Description("Đăng ký thẻ thư viện")]

  LIBRARY_CARD_EXTENSION, // [Description("Gia hạn thẻ thư viện")]

  DIGITAL_EXTENSION, // [Description("Gia hạn tài liệu điện tử")]
}

export enum EStockTransactionType {
  NEW,
  ADDITIONAL,
  DAMAGED,
  LOST,
  OUTDATED,
  TRANSFERRED,
  OTHER,
}

export enum EBorrowDigitalStatus {
  Active,
  Expired,
  Cancelled,
}

export enum EBorrowType {
  IN_LIBRARY,
  TAKE_HOME,
}

export enum EBorrowRecordStatus {
  BORROWING,
  RETURNED,
  OVERDUE,
  LOST,
}

export enum EReservationQueueStatus {
  PENDING,
  ASSIGNED,
  COLLECTED,
  EXPIRED,
  CANCELLED,
}

export enum ETrainingStatus {
  IN_PROGRESS,
  COMPLETED,
  FAILED,
}

export enum EDashboardPeriodLabel {
  DAILY,
  WEEKLY,
  MONTHLY,
}
