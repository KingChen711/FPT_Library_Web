import { ERoleType } from "@/lib/types/enums"
import { type User } from "@/lib/types/models"

export const userTableData: User[] = [
  {
    userId: "u8gr56j7",
    email: "ken.adams@gmail.com",
    firstName: "Ken",
    lastName: "Adams",
    dob: "1990-05-15",
    phone: "0123456789",
    avatar: "https://i.pravatar.cc/150?u=u8gr56j7",
    isActive: true,
    gender: "Male",
    role: {
      roleId: 1,
      vietnameseName: "Quản lý",
      englishName: "Manager",
      roleType: ERoleType.USER,
      rolePermissions: [],
    },
    address: "123 Main St, Anytown, USA",
  },
]
