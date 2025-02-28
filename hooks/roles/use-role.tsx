import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Role } from "@/lib/types/models"

function useRole(
  roleId: number,
  callback?: (data: Role) => void,
  enabled = false
) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["roles", roleId, accessToken],
    queryFn: async () => {
      try {
        await http
          .get<Role>(`/api/management/roles/${roleId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => res.data)
          .then((res) => {
            if (callback) callback(res)
          })
      } catch {
        //error
      }
    },
    placeholderData: keepPreviousData,

    enabled,
  })
}

export default useRole
