"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Author, type LibraryItem } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"

import { useAuth } from "./auth-provider"

type FavouriteProviderProps = {
  children: React.ReactNode
}

type FavouriteContextType = {
  favouriteItemIds: number[]
  toggleFavorite: (id: number) => void
}

export const FavouriteContext = createContext<FavouriteContextType | null>(null)

const FavouriteProvider = ({ children }: FavouriteProviderProps) => {
  const { accessToken } = useAuth()

  const [favouriteItemIds, setFavouriteItemIds] = useState<number[]>([])

  const {
    data: favouriteData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["favourite", accessToken],
    enabled: accessToken !== undefined,
    queryFn: async () =>
      accessToken
        ? http
            .get<
              Pagination<
                {
                  libraryItem: LibraryItem & {
                    libraryItemAuthors: { author: Author }[]
                  }
                }[]
              >
            >("/api/user-favorite", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            })
            .then((res) => ({
              ...res.data,
              sources: res.data.sources.map((s) => ({
                ...s,
                libraryItem: {
                  ...s.libraryItem,
                  authors: s.libraryItem.libraryItemAuthors.map(
                    (l) => l.author
                  ),
                },
              })),
            }))
        : null,
  })

  useEffect(() => {
    if (favouriteData) {
      setFavouriteItemIds(
        favouriteData.sources.map((s) => s.libraryItem.libraryItemId)
      )
    }
  }, [favouriteData])

  const { mutate: deleteFavourite } = useMutation({
    mutationFn: async (itemId: number) => {
      await http.delete(`/api/user-favorite/remove/${itemId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    },
  })

  const { mutate: addFavourite } = useMutation({
    mutationFn: async (itemId: number) => {
      await http.post(
        `/api/user-favorite/add/${itemId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
    },
  })

  const toggleFavorite = (itemId: number) => {
    if (isLoading) return
    const isFavourite = favouriteItemIds.includes(itemId)

    // Optimistic update
    setFavouriteItemIds((prev) =>
      isFavourite ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )

    const mutation = isFavourite ? deleteFavourite : addFavourite

    mutation(itemId, {
      onSuccess: () => {
        refetch()
      },
      onError: () => {
        // Rollback khi có lỗi

        setFavouriteItemIds((prev) =>
          isFavourite ? [...prev, itemId] : prev.filter((id) => id !== itemId)
        )
      },
      // Optional: bạn có thể dùng onSuccess hoặc onSettled để refetch nếu muốn sync lại
    })
  }

  return (
    <FavouriteContext.Provider value={{ favouriteItemIds, toggleFavorite }}>
      {children}
    </FavouriteContext.Provider>
  )
}

export default FavouriteProvider

export const useFavourite = () => {
  const context = useContext(FavouriteContext)
  if (!context) {
    throw new Error("useFavourite must be used within a FavouriteProvider")
  }
  return context
}
