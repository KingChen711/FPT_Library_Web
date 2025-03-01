import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type LibraryPackage } from "@/lib/types/models"

function useGetPackages() {
  return useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await http.get<LibraryPackage[]>(`/api/packages`)
      return res.data
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useGetPackages
