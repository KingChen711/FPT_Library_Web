import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"

export type TGetEmployeeRolesData = {
  roleId: number
  vietnameseName: string
  englishName: string
  roleType: string
  rolePermissions: unknown[]
}[]

const useEmployeeRoles = () => {
  const { getAccessToken } = useAuth()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["employee-roles"],
    queryFn: async () => {
      try {
        const data = await http
          .get<TGetEmployeeRolesData>(`/api/management/roles/employees`, {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
            },
          })
          .then((res) => res.data)

        return data
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })

  return { data, isLoading, isError }
}

export default useEmployeeRoles
