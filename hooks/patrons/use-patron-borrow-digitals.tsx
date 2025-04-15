/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { http } from "@/lib/http"
import { type BookResource, type BorrowDigital } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchBorrowDigitalsManagementSchema } from "@/lib/validations/borrow-digitals-management/search-borrow-digitals-management"

function usePatronBorrowDigitals(
  userId: string,
  searchParams: TSearchBorrowDigitalsManagementSchema
) {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: [
      "management",
      "borrow-digitals",
      accessToken,
      userId,
      searchParams,
    ],
    queryFn: async () => {
      Object.keys(searchParams.v).forEach((k) => {
        //@ts-ignore
        const value = searchParams.v[k]

        if (value === "null,null") {
          //@ts-ignore
          searchParams.v[k] = ""
        }
      })
      const formatDate = (d: Date) => format(d, "yyyy-MM-dd")
      try {
        if (!accessToken) throw new Error()

        const { data } = await http.get<
          Pagination<(BorrowDigital & { libraryResource: BookResource })[]>
        >(`/api/management/library-card-holders/${userId}/borrows/digital`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          searchParams: {
            ...searchParams,
            expiryDateRange:
              JSON.stringify(searchParams.expiryDateRange) ===
              JSON.stringify([null, null])
                ? null
                : searchParams.expiryDateRange.map((d) =>
                    d === null ? "" : formatDate(new Date(d))
                  ),
            registerDateRange:
              JSON.stringify(searchParams.registerDateRange) ===
              JSON.stringify([null, null])
                ? null
                : searchParams.registerDateRange.map((d) =>
                    d === null ? "" : formatDate(new Date(d))
                  ),
          },
        })

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

export default usePatronBorrowDigitals
