import { http } from "@/lib/http"

import { auth } from "../auth"

export type TEmployeeRole = {
  roleId: number
  vietnameseName: string
  englishName: string
  roleType: string
  rolePermissions: unknown[]
}

const getEmployeeRoles = async (): Promise<TEmployeeRole[]> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TEmployeeRole[]>(
      `/api/management/roles/employees`,
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

export default getEmployeeRoles
