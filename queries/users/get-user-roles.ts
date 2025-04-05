import { http } from "@/lib/http"

import { auth } from "../auth"

export type TUserRole = {
  roleId: number
  vietnameseName: string
  englishName: string
  roleType: string
  rolePermissions: unknown[]
}

const getUserRoles = async (): Promise<TUserRole[]> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TUserRole[]>(
      `/api/management/roles/users`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    return data
  } catch {
    return []
  }
}

export default getUserRoles
