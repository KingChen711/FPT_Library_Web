import { useQuery } from "@tanstack/react-query"
import axios from "axios"

type BookData = {
  publishers?: string[]
  title?: string
  number_of_pages?: number
  isbn_13?: string[]
  publish_date?: string //string of year
  authors?: {
    key: string
    name: string
  }[]
  works?: {
    key: string
  }[]
}

export type TSearchIsbnRes = {
  title?: string
  publishers?: string
  pageCount?: number
  isbn?: string
  publicationYear?: number
  authors?: string
  summary?: string
  coverImage?: string
}

function useSearchIsbn(isbn: string) {
  const isbnKey = `ISBN:${isbn}`

  return useQuery({
    queryKey: ["search-isbn", isbn],
    queryFn: async (): Promise<TSearchIsbnRes | null> => {
      try {
        const { data } = await axios.get<{
          [key: string]: { details: BookData }
        }>(
          `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`
        )

        const bookData = data[isbnKey]?.details

        let summary: string | undefined = undefined

        try {
          if (bookData.works) {
            const { data } = await axios.get<{ description: string }>(
              `https://openlibrary.org${bookData.works[0].key}.json`
            )
            summary = data?.description || undefined
          }
        } catch (error) {
          console.log(error)
        }

        return {
          authors:
            bookData.authors && bookData.authors.map((a) => a.name).join(", "),
          coverImage: `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
          summary,
          isbn,
          pageCount: bookData.number_of_pages,
          publicationYear: bookData.publish_date
            ? Number(bookData.publish_date)
            : undefined,
          publishers: bookData.publishers && bookData.publishers.join(", "),
          title: bookData.title,
        }
      } catch {
        return null
      }
    },
    enabled: isbn !== "",
    refetchOnWindowFocus: false,
  })
}

export default useSearchIsbn
