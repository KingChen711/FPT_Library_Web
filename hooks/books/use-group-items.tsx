"use client"

import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { z } from "zod"

import { http } from "@/lib/http"
import {
  type Author,
  type BookEdition,
  type Category,
} from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"

export const searchGroupItemsSchema = z.object({
  pageIndex: z.coerce.number().min(1).catch(1),
  pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("10"),
  search: z.string(),
})

export type TSearchGroupItemsSchema = z.infer<typeof searchGroupItemsSchema>

type TGroupItems = (BookEdition & { category: Category; authors: Author[] })[]

function useGroupItems(
  libraryItemId: number,
  searchParams: TSearchGroupItemsSchema
) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["items", searchParams, accessToken],
    queryFn: async (): Promise<Pagination<TGroupItems>> => {
      if (!accessToken)
        return {
          sources: [],
          pageIndex: searchParams.pageIndex,
          pageSize: +searchParams.pageSize,
          totalActualItem: 0,
          totalPage: 0,
        }
      try {
        const { data } = await http.get<Pagination<TGroupItems>>(
          `/api/management/library-items/${libraryItemId}/group`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            searchParams,
          }
        )
        return data
      } catch {
        return {
          sources: [],
          pageIndex: searchParams.pageIndex,
          pageSize: +searchParams.pageSize,
          totalActualItem: 0,
          totalPage: 0,
        }
      }
    },
    placeholderData: keepPreviousData,
  })
}

export default useGroupItems
