import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type LibraryItem } from "@/lib/types/models"

function useLibraryItemDetail(
  libraryItemId: number | undefined,
  enabled = true,
  email = true
) {
  const { user } = useAuth()
  return useQuery({
    queryKey: [
      `library-items/${libraryItemId}`,
      email ? user?.email || "no-email" : "no-email",
    ],
    queryFn: async () => {
      if (!libraryItemId) return null
      try {
        const { data } = await http.get<LibraryItem | null>(
          `/api/library-items/${libraryItemId}?${email ? `email=${user?.email || ""}` : ""}`
          // {
          //   headers: {
          //     Authorization: `Bearer ${accessToken}`,
          //   },
          // }
        )

        return data
      } catch {
        return null
      }
    },
    enabled,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useLibraryItemDetail
