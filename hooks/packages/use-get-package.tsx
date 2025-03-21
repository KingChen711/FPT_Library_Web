import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Package } from "@/lib/types/models"

function useGetPackage(libraryPackageId: string) {
  return useQuery({
    queryKey: [`/packages/${libraryPackageId}`],
    queryFn: async () => {
      const res = await http.get<Package>(
        `/api/packages/${libraryPackageId}`,
        {}
      )
      return res.data
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useGetPackage
