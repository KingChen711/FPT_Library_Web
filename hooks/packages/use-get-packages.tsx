import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Package } from "@/lib/types/models"

function useGetPackages() {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await http.get<Package[]>(`/api/packages`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      return res.data
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useGetPackages
