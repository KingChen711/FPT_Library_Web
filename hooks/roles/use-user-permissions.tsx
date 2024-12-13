import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"

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

function useUserPermissions(isRoleVerticalLayout = false) {
  return useQuery({
    queryKey: ["roles", "user-permissions", isRoleVerticalLayout],
    queryFn: async () => {
      try {
        const { data } = await http.get<TUserPermissions>(
          `/api/roles/user-permissions?isRoleVerticalLayout=${isRoleVerticalLayout}`
        )

        data.columnHeaders.unshift("Feature name")

        return data
      } catch {
        return {
          columnHeaders: [],
          dataRows: [],
        }
      }
    },
    placeholderData: keepPreviousData,
  })
}

export default useUserPermissions
