import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type LibraryCard, type LibraryCardHolder } from "@/lib/types/models"

export type ScannedPatron = LibraryCardHolder & { libraryCard: LibraryCard }

function useGetPatronByBarcode() {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async (barcode: string): Promise<ScannedPatron | null> => {
      if (!barcode) return null

      try {
        const { data } = await http.get<ScannedPatron>(
          `/api/library-card-holders/get-by-barcode?barcode=${barcode}`,
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

export default useGetPatronByBarcode
