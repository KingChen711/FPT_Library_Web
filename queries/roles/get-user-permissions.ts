import { http } from "@/lib/http"

import "server-only"

export type TUserPermissions = {
  columnHeaders: string[]
  dataRows: {
    cells: {
      colId: number
      rowId: number
      permissionId: number
      cellContent: string
    }[]
  }[]
}

const getUserPermissions = async (
  isRoleVerticalLayout: boolean
): Promise<TUserPermissions> => {
  try {
    const { data } = await http.get<TUserPermissions>(
      `/api/roles/user-permissions?isRoleVerticalLayout=${isRoleVerticalLayout}`,
      {
        next: {
          tags: ["user-permissions"],
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
