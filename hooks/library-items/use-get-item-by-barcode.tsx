import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"

import { http } from "@/lib/http"
import {
  type Author,
  type BookEdition,
  type Category,
  type LibraryItemAuthor,
  type LibraryItemInstance,
  type Shelf,
} from "@/lib/types/models"

export type Response = LibraryItemInstance & {
  libraryItem: BookEdition & {
    shelf: Shelf | null
    category: Category
    libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
  }
}

export type ScannedItem = LibraryItemInstance & {
  libraryItem: BookEdition & {
    shelf: Shelf | null
    category: Category
    authors: Author[]
  }
}

function useGetItemByBarcode() {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async (barcode: string): Promise<ScannedItem | null> => {
      if (!barcode) return null

      try {
        const { data } = await http.get<Response>(
          `/api/management/library-items/instances/code?barcode=${barcode}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        return {
          ...data,
          libraryItem: {
            ...data.libraryItem,
            authors: data.libraryItem.libraryItemAuthors.map((ia) => ia.author),
          },
        }
      } catch {
        return null
      }
    },
  })
}

export default useGetItemByBarcode
