import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type LibraryCardHolder } from "@/lib/types/models"

export type CurrentUser = {
  userId: string
  roleId: number
  libraryCardId: string
  email: string
  firstName: string
  lastName: string
  passwordHash: string | null
  phone: string
  avatar: string | null
  address: string | null
  gender: string
  dob: string
  isActive: boolean
  isDeleted: boolean
  isEmployeeCreated: boolean
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
  role: {
    roleId: number
    vietnameseName: string
    englishName: string
    roleType: string
  }
  libraryCard: LibraryCardHolder
  notificationRecipients: unknown[]
}

function useCurrentUser() {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await http.get<CurrentUser>(`/api/auth/current-user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return res.data
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useCurrentUser
