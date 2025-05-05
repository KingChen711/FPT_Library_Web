import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"

export type TGetUserRolesData = {
  roleId: number
  vietnameseName: string
  englishName: string
  roleType: string
  rolePermissions: unknown[]
}[]

const useUserRoles = () => {
  const { accessToken } = useAuth()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      try {
        const data = await http
          .get<TGetUserRolesData>(`/api/management/roles/users`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => res.data)

        return data
      } catch (error) {
        throw error
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })

  return { data, isLoading, isError }
}

export default useUserRoles
