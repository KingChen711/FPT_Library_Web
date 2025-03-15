import { keepPreviousData, useQuery } from "@tanstack/react-query"
import axios from "axios"

import { EBookCopyStatus } from "@/lib/types/enums"

function useAutoCompleteBooks(term = "") {
  return useQuery({
    queryKey: ["autocomplete-books", term],
    queryFn: async (): Promise<
      {
        libraryItemId: number
        title: string
        coverImage: string | null
        available: boolean
      }[]
    > => {
      if (!term) return []

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_ELASTICSEARCH_URL}/library_items/_search`,
          {
            headers: { "Content-Type": "application/json" },
            params: {
              source: JSON.stringify({
                size: 8,
                query: {
                  match_phrase_prefix: {
                    title: term,
                  },
                },
                _source: [
                  "library_item_id",
                  "title",
                  "cover_image",
                  "library_item_instances",
                ],
              }),
              source_content_type: "application/json",
            },
          }
        )

        // Extract and format results
        const results = response.data.hits.hits.map(
          (hit: {
            _source: {
              library_item_id: number
              title: string
              cover_image: string | null
              library_item_instances: {
                status: EBookCopyStatus
              }[]
            }
          }) => ({
            id: hit._source.library_item_id,
            title: hit._source.title,
            coverImage: hit._source.cover_image,
            available: hit._source.library_item_instances.some(
              (i) => i.status === EBookCopyStatus.IN_SHELF
            ),
          })
        )

        return results
      } catch (error) {
        return []
      }
    },

    placeholderData: keepPreviousData,
  })
}

export default useAutoCompleteBooks
