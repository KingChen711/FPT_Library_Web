import { useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"

function useGetOwnResource(resourceId: number) {
  return useQuery({
    queryKey: [`/resources/${resourceId}`],
    queryFn: async () => {
      try {
        const { data } = await http.get<Blob>(
          `/api/library-items/resource/${resourceId}`
        )

        const url = URL.createObjectURL(data)

        return {
          isSuccess: true,
          data: url,
        }
      } catch {
        return []
      }
    },
    refetchOnWindowFocus: false,
  })
}

export default useGetOwnResource
