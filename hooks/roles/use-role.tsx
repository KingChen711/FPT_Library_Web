import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Role } from "@/lib/types/models"

function useRole(
  roleId: number,
  callback?: (data: Role) => void,
  enabled = false
) {
  return useQuery({
    queryKey: ["roles", roleId],
    queryFn: async () => {
      try {
        await http
          .get<Role>(`/api/roles/${roleId}`)
          .then((res) => res.data)
          .then((res) => {
            if (callback) callback(res)
          })
      } catch {
        //error
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    enabled,
  })
}

export default useRole
