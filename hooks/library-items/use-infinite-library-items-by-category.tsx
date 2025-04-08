"use client"

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import type { LibraryItem } from "@/lib/types/models"

export type ApiNewArrivalsResponse = {
  sources: LibraryItem[]
  pageIndex: number
  pageSize: number
  totalPage: number
  totalActualItem: number
}

export const fetchLibraryItemsByCategory = async (
  pageIndex: number,
  pageSize: number,
  categoryId: number
) => {
  try {
    const { data } = await http.get<ApiNewArrivalsResponse>(
      `/api/library-items/category/${categoryId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
    )
    return {
      items: data.sources,
      totalPages: data.totalPage,
      totalItems: data.totalActualItem,
    }
  } catch {
    return {
      items: [],
      totalPages: 0,
      totalItems: 0,
    }
  }
}

type TSearchLibraryItemsByCategory = {
  pageSize?: number
  categoryId: number
}

function useInfiniteLibraryItemByCategory({
  pageSize = 12,
  categoryId,
}: TSearchLibraryItemsByCategory) {
  return useInfiniteQuery({
    queryKey: [
      `/infinite-library-items-by-category/${categoryId}`,
      { pageSize },
    ],
    queryFn: ({ pageParam }) =>
      fetchLibraryItemsByCategory(pageParam, pageSize, categoryId),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loadedItemsCount = allPages.reduce(
        (total, page) => total + page.items.length,
        0
      )

      if (lastPage.totalItems > loadedItemsCount) {
        return allPages.length + 1
      }

      return undefined
    },
    placeholderData: keepPreviousData,
  })
}

export default useInfiniteLibraryItemByCategory
