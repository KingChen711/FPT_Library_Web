"use client"

import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Notification } from "@/lib/types/models"

const PAGE_SIZE = 8

export type ApiNotificationsResponse = {
  sources: Notification[]
  pageIndex: number
  pageSize: number
  totalPage: number
}

export const fetchNotifications = async (
  page: number,
  token: string | null,
  search: string
) => {
  try {
    if (!token) return []
    const { data } = await http.get<ApiNotificationsResponse>(
      `/api/privacy/notifications?PageIndex=${page}&PageSize=${PAGE_SIZE}&Search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return data.sources
  } catch {
    return []
  }
}

type TSearchNotification = {
  pageSize?: number
  search?: string
}

function useInfiniteNotifications({
  pageSize = PAGE_SIZE,
  search = "",
}: TSearchNotification) {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: ["infinite-notifications", { pageSize, search }, accessToken],
    queryFn: ({ pageParam }) =>
      fetchNotifications(pageParam, accessToken, search),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === pageSize ? allPages.length + 1 : undefined
    },
    placeholderData: keepPreviousData,
  })
}

export default useInfiniteNotifications
