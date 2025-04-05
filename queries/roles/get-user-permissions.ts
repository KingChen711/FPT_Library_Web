import { http } from "@/lib/http"

import "server-only"

import { auth } from "../auth"

export type TUserPermissions = {
  columnHeaders: string[]
  dataRows: {
    cells: {
      colId: number
      rowId: number
      permissionId: number
      cellContent: string
      isModifiable: boolean
    }[]
  }[]
}

const getUserPermissions = async (
  isRoleVerticalLayout: boolean
): Promise<TUserPermissions> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TUserPermissions>(
      `/api/management/roles/user-permissions?isRoleVerticalLayout=${isRoleVerticalLayout}`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    return data
  } catch {
    return {
      columnHeaders: [],
      dataRows: [],
    }
  }
}

export default getUserPermissions
