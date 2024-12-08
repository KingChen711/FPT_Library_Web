export enum ERole {
  STUDENT = "Student",
  STAFF = "Staff",
  ADMIN = "Admin",
  TEACHER = "Teacher",
}

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
