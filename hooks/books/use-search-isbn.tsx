import { useQuery } from "@tanstack/react-query"
import axios from "axios"

type BookData = {
  publishers?: string[]
  title?: string
  number_of_pages?: number
  isbn_13?: string[]
  publish_date?: string //string of year
  authors?: {
    key?: string
    name?: string
  }[]
  works?: {
    key?: string
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
  notFound: boolean
}

function useSearchIsbn(isbn: string) {
  const isbnKey = `ISBN:${isbn}`

  return useQuery({
    queryKey: ["search-isbn", isbn],
    queryFn: async (): Promise<TSearchIsbnRes> => {
      try {
        const { data } = await axios.get<{
          [key: string]: { details: BookData }
        }>(
          `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`
        )

        const bookData = data[isbnKey]?.details

        let summary: string | undefined = undefined

        try {
          if (bookData.works?.[0]?.key) {
            const { data } = await axios.get<{
              description: string | { value?: string }
            }>(`https://openlibrary.org${bookData.works[0].key}.json`)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore

            summary = data?.description?.value || data?.description || undefined
          }
        } catch {}

        return {
          authors:
            bookData.authors &&
            bookData.authors
              .map((a) => a.name)
              .filter(Boolean)
              .join(", "),
          coverImage: `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
          summary,
          isbn,
          pageCount: bookData.number_of_pages,
          publicationYear: bookData.publish_date
            ? Number(bookData.publish_date)
            : undefined,
          publishers: bookData.publishers && bookData.publishers.join(", "),
          title: bookData.title,
          notFound: false,
        }
      } catch {
        return {
          isbn,
          notFound: true,
        }
      }
    },
    enabled: isbn !== "",
  })
}

export default useSearchIsbn
