import { keepPreviousData, useQuery } from "@tanstack/react-query"
import axios from "axios"

import { EBookCopyStatus, type EBookEditionStatus } from "@/lib/types/enums"
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
              }),
              source_content_type: "application/json",
            },
          }
        )

        // Extract and format results
        const results: (BookEdition & {
          libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
          available: boolean
        })[] = response.data.hits.hits.map(
          (hit: {
            _source: {
              library_item_id: number
              title: string
              cover_image: string | null
              library_item_instances: {
                status: EBookCopyStatus
              }[]
              additional_authors: string | null
              category_id: number
              classification_number: string | null
              cutter_number: string | null
              dimensions: string | null
              ean: string | null
              edition: string | null
              edition_number: number | null
              estimated_price: number | null
              general_note: string | null
              genres: string | null
              isbn: string | null
              language: string | null
              origin_language: string | null
              physical_details: string | null
              publisher: string | null
              publication_place: string | null
              responsibility: string | null
              sub_title: string | null
              summary: string | null
              topical_terms: string | null
              page_count: number | null
              publication_year: number | null
              is_deleted: boolean
              status: EBookEditionStatus
              authors: {
                author_id: number
                author_code: string
                author_image: string
                full_name: string
                biography: string
                dob: Date | null
                nationality: string
                is_deleted: boolean
              }[]
            }
          }) =>
            ({
              id: hit._source.library_item_id,
              title: hit._source.title,
              coverImage: hit._source.cover_image,
              accompanyingMaterial: null,
              additionalAuthors: hit._source.additional_authors,
              avgReviewedRate: null,
              bibliographicalNote: "",
              canBorrow: false,
              categoryId: hit._source.category_id,
              classificationNumber: hit._source.classification_number,
              createdAt: new Date(),
              createdBy: "",
              cutterNumber: hit._source.cutter_number,
              dimensions: hit._source.dimensions,
              ean: hit._source.ean,
              edition: hit._source.edition,
              editionNumber: hit._source.edition_number,
              estimatedPrice: hit._source.estimated_price,
              generalNote: hit._source.general_note,
              genres: hit._source.genres,
              groupId: 0,
              isbn: hit._source.isbn,
              isDeleted: hit._source.is_deleted,
              isTrained: false,
              language: hit._source.language,
              libraryItemAuthors: hit._source.authors.map((a) => ({
                authorId: a.author_id,
                createdAt: new Date(),
                createdBy: "",
                libraryItemAuthorId: a.author_id,
                libraryItemId: 1,
                updatedAt: null,
                updatedBy: null,
                author: {
                  authorCode: a.author_code,
                  authorId: a.author_id,
                  authorImage: a.author_image,
                  biography: a.biography,
                  fullName: a.full_name,
                  bookEditionAuthors: [],
                  createDate: new Date(),
                  isDeleted: false,
                  nationality: "",
                  updateDate: new Date(),
                  dateOfDeath: new Date(),
                  dob: new Date(),
                },
              })),
              libraryItemId: hit._source.library_item_id,
              originLanguage: hit._source.origin_language,
              pageCount: hit._source.page_count,
              physicalDetails: hit._source.physical_details,
              publicationPlace: hit._source.publication_place,
              publicationYear: hit._source.publication_year,
              publisher: hit._source.publisher,
              responsibility: hit._source.responsibility,
              shelfId: 1,
              status: hit._source.status,
              subTitle: hit._source.sub_title,
              summary: hit._source.summary,
              topicalTerms: hit._source.topical_terms,
              trainedAt: null,
              updatedAt: null,
              updatedBy: "",
              available: hit._source.library_item_instances.some(
                (a) => a.status === EBookCopyStatus.IN_SHELF
              ),
            }) as BookEdition & {
              libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
              available: boolean
            }
        )

        return results
      } catch {
        return []
      }
    },
    enabled,
    placeholderData: keepPreviousData,
  })
}

export default useAutoCompleteBooks
