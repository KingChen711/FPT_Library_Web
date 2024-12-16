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
  SECURITY_MANAGEMENT = "/me/account/setting",
  INTERFACE_MANAGEMENT = "/me/account/interface",
  NOTIFICATION_MANAGEMENT = "/me/account/notification",
}

export enum FEATURE {
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
