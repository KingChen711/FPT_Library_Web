import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import axios from "axios"

function useAutoCompleteBooks(term = "") {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: ["autocomplete-books", term, accessToken],
    queryFn: async (): Promise<
      { libraryItemId: number; title: string; coverImage: string | null }[]
    > => {
      if (!term || !accessToken) return []

      try {
        const response = await axios.get(
          "http://localhost:9200/library_items/_search",
          {
            headers: { "Content-Type": "application/json" },
            params: {
              source: JSON.stringify({
                size: 5,
                query: {
                  match_phrase_prefix: {
                    title: term,
                  },
                },
                _source: ["library_item_id", "title", "cover_image"],
              }),
              source_content_type: "application/json",
            },
          }
        )

        console.log(response)

        // Extract and format results
        const results = response.data.hits.hits.map(
          (hit: {
            _source: {
              library_item_id: number
              title: string
              cover_image: string | null
            }
          }) => ({
            id: hit._source.library_item_id,
            title: hit._source.title,
            coverImage: hit._source.cover_image,
          })
        )

        return results
      } catch {
        return []
      }
    },

    placeholderData: keepPreviousData,
  })
}

export default useAutoCompleteBooks
