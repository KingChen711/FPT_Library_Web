export enum ERoleType {
  USER = "User",
  EMPLOYEE = "Employee",
}

export const ERoleTypeToIndex: Map<ERoleType, number> = new Map([
  [ERoleType.USER, 0],
  [ERoleType.EMPLOYEE, 1],
])

export const IndexToERoleType: Map<number, ERoleType> = new Map([
  [0, ERoleType.USER],
  [1, ERoleType.EMPLOYEE],
])

export enum ESystemRoutes {
  // Management
  MANAGEMENT = "/management",

  // User management
  USER_MANAGEMENT = "/management/users",

  // Account
  ACCOUNT_MANAGEMENT = "/me/account",
  PROFILE_MANAGEMENT = "/me/account/profile",
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
  BOOK_MANAGEMENT = 5,
  BORROW_MANAGEMENT = 6,
  TRANSACTION_MANAGEMENT = 7,
  SYSTEM_CONFIGURATION_MANAGEMENT = 8,
  SYSTEM_HEALTH_MANAGEMENT = 9,
}

export enum EAccessLevel {
  ACCESS_DENIED = 0,
  VIEW = 1,
  MODIFY = 2,
  CREATE = 3,
  FULL_ACCESS = 4,
}

export enum ENotificationType {
  EVENT = "Event",
  REMINDER = "Reminder",
  NOTICE = "Notice",
}
