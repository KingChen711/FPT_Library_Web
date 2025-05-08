"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useInView } from "react-intersection-observer"

import { http } from "@/lib/http"
import { type Author, type LibraryItem } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchRecommendSchema } from "@/lib/validations/books/search-recommend-schema"
import BrowseBookCardSkeleton from "@/components/ui/browse-book-card"
import NoResult from "@/components/ui/no-result"

import BookItemCard from "../../(home)/_components/book-item-card"

const pageSize = 12

export const fetchRecommendBooks = async (
  page: number,
  token: string | null,
  searchParams: TSearchRecommendSchema
) => {
  try {
    if (!token) return []
    const { data } = await http.get<
      Pagination<(LibraryItem & { libraryItemAuthors: { author: Author }[] })[]>
    >(`/api/recommend`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      searchParams: { ...searchParams, pageSize, pageIndex: page },
    })

    return data.sources.map((s) => ({
      ...s,
      authors: s.libraryItemAuthors.map((l) => l.author),
    }))
  } catch {
    return []
  }
}

type Props = {
  searchParams: TSearchRecommendSchema
}

function InfinityBooks({ searchParams }: Props) {
  const refContainer = useRef<HTMLDivElement>(null)
  const [is5ItemsARow, setIs5ItemsARow] = useState(false)

  useEffect(() => {
    const element = refContainer.current
    if (!element) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setIs5ItemsARow(
            entry.contentRect.width >= 1296 && entry.contentRect.width <= 1560
          )
        }
      }
    })

    resizeObserver.observe(element)

    // Cleanup
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const { accessToken } = useAuth()
  const t = useTranslations("BookPage")
  const { ref, inView } = useInView()
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["infinite-recommend-books", searchParams, accessToken],
    queryFn: ({ pageParam }) =>
      fetchRecommendBooks(pageParam, accessToken, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === pageSize ? allPages.length + 1 : undefined
    },
  })

  const items = data?.pages.flat() ?? []

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const virtualItemCount = useMemo(
    () =>
      is5ItemsARow
        ? (5 - (items.length % 5)) % 5
        : (pageSize - (items.length % pageSize)) % pageSize,
    [is5ItemsARow, items.length]
  )

  useEffect(() => {
    console.log(virtualItemCount)
  }, [virtualItemCount])

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={refContainer}
        className="flex w-full flex-wrap justify-between gap-6"
      >
        {status === "pending" || isLoading ? (
          <>
            {Array(pageSize)
              .fill(null)
              .map((_, i) => (
                <BrowseBookCardSkeleton
                  key={i}
                  className="min-w-[240px] max-w-[340px] flex-1"
                />
              ))}
          </>
        ) : status === "error" || isLoading ? (
          <NoResult
            title={t("Recommend Books Not Found")}
            description={t("No books were found that matched your needs")}
          />
        ) : (
          <>
            {[...items, ...Array(virtualItemCount).fill(null)].map(
              (item, i) => {
                if (!item) {
                  if (isFetchingNextPage || isLoading)
                    return (
                      <BrowseBookCardSkeleton
                        key={i}
                        className="min-w-[240px] max-w-[340px] flex-1"
                      />
                    )
                  return (
                    <div
                      key={i}
                      className="min-w-[240px] max-w-[340px] flex-1"
                    />
                  )
                }
                return (
                  <div
                    key={item.libraryItemId}
                    className="min-w-[240px] max-w-[340px] flex-1"
                  >
                    <BookItemCard item={item} />
                  </div>
                )
              }
            )}
            {hasNextPage && (
              <div
                ref={ref}
                className="flex w-full flex-wrap justify-between gap-6"
              >
                {(isFetchingNextPage || isLoading) &&
                  Array(pageSize)
                    .fill(null)
                    .map((_, i) => (
                      <BrowseBookCardSkeleton
                        key={i}
                        className="min-w-[240px] max-w-[340px] flex-1"
                      />
                    ))}
              </div>
            )}
          </>
        )}
      </div>

      {!hasNextPage &&
        !isLoading &&
        status !== "pending" &&
        (items.length === 0 ? (
          <NoResult
            title={t("Recommend Books Not Found")}
            description={t("No books were found that matched your needs")}
          />
        ) : (
          <div ref={ref} className="text-center text-sm font-bold">
            {t("That your all recommend books")}
          </div>
        ))}
    </div>
  )
}

export default InfinityBooks
