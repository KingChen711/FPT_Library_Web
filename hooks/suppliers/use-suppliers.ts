import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Supplier } from "@/lib/types/models"

function useSuppliers() {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["suppliers", accessToken],
    queryFn: async () => {
      try {
        const { data } = await http.get<Supplier[]>(
          `/api/management/suppliers`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        return data
      } catch {
        return []
      }
    },
    enabled: !!accessToken,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useSuppliers
