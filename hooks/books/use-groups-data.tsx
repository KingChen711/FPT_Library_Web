//GroupsData
import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import {
  type Author,
  type BookEdition,
  type Category,
  type Condition,
  type ConditionHistory,
  type LibraryItemGroup,
  type LibraryItemInstance,
  type LibraryItemInventory,
  type Shelf,
} from "@/lib/types/models"

type BookDetail = BookEdition & {
  category: Category
  shelf: Shelf | null
  libraryItemGroup: LibraryItemGroup | null
  libraryItemInventory: LibraryItemInventory
  resources: []
  authors: Author[]
  libraryItemInstances: (LibraryItemInstance & {
    libraryItemConditionHistories: (ConditionHistory & {
      condition: Condition
    })[]
  })[]
}

export type GroupData = {
  booksData: {
    authors: string[]
    generalNote: string | null
    publisher: string
    subTitle: string | null
    title: string
  }[]
}

function useGroupsData(
  groups: {
    bookIds: number[]
  }[],
  enabled: boolean
) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["groups-data", groups, accessToken],
    queryFn: async (): Promise<GroupData[]> => {
      if (!accessToken) return []

      try {
        return await Promise.all(
          groups.map(async (g): Promise<GroupData> => {
            const books = await Promise.all(
              g.bookIds.map(async (id) => {
                const { data } = await http.get<BookDetail>(
                  `/api/management/library-items/${id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                )

                return data
              })
            )

            return {
              booksData: books.map((b) => ({
                authors: b.authors.map((a) => a.fullName),
                generalNote: b.generalNote,
                publisher: b.publisher || "",
                subTitle: b.subTitle,
                title: b.title,
              })),
            }
          })
        )
      } catch {
        return []
      }
    },

    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    enabled,
  })
}

export default useGroupsData
