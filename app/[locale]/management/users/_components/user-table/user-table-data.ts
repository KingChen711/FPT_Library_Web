import { ERoleType } from "@/lib/types/enums"
import { type User } from "@/lib/types/models"

export const userTableData: User[] = [
  {
    userId: "00000000-0000-0000-0000-000000000000",
    userCode: null,
    email: "thanhdvse171867@fpt.edu.vn",
    passwordHash: null,
    firstName: "Thanh",
    lastName: "ThanhDoan",
    dob: null,
    phone: null,
    avatar: null,
    address: null,
    gender: null,
    isActive: true,
    isDeleted: false,
    createDate: "2024-12-13T20:01:37.78",
    modifiedDate: null,
    modifiedBy: null,
    twoFactorEnabled: false,
    phoneNumberConfirmed: false,
    emailConfirmed: true,
    twoFactorSecretKey: null,
    twoFactorBackupCodes: null,
    phoneVerificationCode: null,
    emailVerificationCode: null,
    phoneVerificationExpiry: null,
    roleId: 0,
    role: {
      roleId: 0,
      vietnameseName: "Quản trị hệ thống",
      englishName: "Administration",
      roleType: ERoleType.USER,
      rolePermissions: [],
    },
  },
]
