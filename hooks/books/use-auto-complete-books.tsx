import { keepPreviousData, useQuery } from "@tanstack/react-query"
import axios from "axios"

import {
  type Author,
  type BookEdition,
  type LibraryItemAuthor,
} from "@/lib/types/models"

type Response = (BookEdition & {
  libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
  available: boolean
})[]

function useAutoCompleteBooks(term = "", enabled = true) {
  return useQuery({
    queryKey: ["autocomplete-books", term],
    queryFn: async (): Promise<Response> => {
      if (!term) return []

      try {
        const response = await axios.get<Response>(`/api/elastic-search`, {
          params: {
            term,
          },
        })

        return response.data
      } catch {
        return []
      }
    },
    enabled,
    placeholderData: keepPreviousData,
  })
}

export default useAutoCompleteBooks
