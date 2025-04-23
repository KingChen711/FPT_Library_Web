"use client"

import { useAuth } from "@/contexts/auth-provider"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { type StockRecommendedBook } from "@/lib/types/models"

type Props = {
  relatedLibraryItemId: number | undefined
  relatedTitle: string | undefined
  enabled: boolean
  onSuccess: () => void
}

function useLibrarianRecommendBooks({
  enabled,
  relatedLibraryItemId,
  relatedTitle,
  onSuccess,
}: Props) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: [
      "librarian-recommend-books",
      { relatedLibraryItemId, relatedTitle, enabled },
      accessToken,
    ],
    queryFn: async (): Promise<StockRecommendedBook[]> => {
      if (!enabled) return []
      const { data } = await axios.post<{
        response: StockRecommendedBook[]
        normalizedTitles: string[]
      }>(
        `/api/librarian-recommend-books`,
        {
          relatedLibraryItemId,
          relatedTitle,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      onSuccess()

      return data.response
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
}

export default useLibrarianRecommendBooks
