import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type BookEdition, type Category } from "@/lib/types/models"

export type ScannedItem = BookEdition & {
  category: Category
}

function useGetItemByISBN() {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async (isbn: string): Promise<ScannedItem | null> => {
      if (!isbn) return null

      try {
        const { data } = await http.get<ScannedItem>(
          `/api/library-items/get-by-isbn?isbn=${isbn}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        return data || null
      } catch {
        return null
      }
    },
  })
}

export default useGetItemByISBN
