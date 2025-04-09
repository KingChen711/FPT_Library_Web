import { http } from "@/lib/http"

import "server-only"

import { format } from "date-fns"

import { ETrackingType } from "@/lib/types/enums"
import { type Tracking } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchSupplementRequestsSchema } from "@/lib/validations/trackings/search-supplement-requests"

import { auth } from "../auth"

export type SupplementRequests = Tracking[]

const getSupplementRequests = async (
  searchParams: TSearchSupplementRequestsSchema
): Promise<Pagination<SupplementRequests>> => {
  const { getAccessToken } = auth()
  try {
    const formatDate = (d: Date) => format(d, "yyyy-MM-dd")
    const { data } = await http.get<Pagination<SupplementRequests>>(
      `/api/management/warehouse-trackings`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          ...searchParams,
          trackingType: ETrackingType.SUPPLEMENT_REQUEST,
          totalItemRange:
            JSON.stringify(searchParams.totalItemRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.totalItemRange.map((a) =>
                  a === null ? "null" : a
                ),
          totalAmountRange:
            JSON.stringify(searchParams.totalAmountRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.totalAmountRange.map((a) =>
                  a === null ? "null" : a
                ),
          entryDateRange:
            JSON.stringify(searchParams.entryDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.entryDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          expectedReturnDateRange:
            JSON.stringify(searchParams.expectedReturnDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.expectedReturnDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          actualReturnDateRange:
            JSON.stringify(searchParams.actualReturnDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.actualReturnDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          createdAtRange:
            JSON.stringify(searchParams.createdAtRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.createdAtRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          updatedAtRange:
            JSON.stringify(searchParams.updatedAtRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.updatedAtRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          dataFinalizationDateRange:
            JSON.stringify(searchParams.dataFinalizationDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.dataFinalizationDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
        },
      }
    )
    console.log(data)

    return data
  } catch (error) {
    console.log("TSearchSupplementRequestsSchema", error)

    return {
      sources: [],
      pageIndex: searchParams.pageIndex,
      pageSize: +searchParams.pageSize,
      totalActualItem: 0,
      totalPage: 0,
    }
  }
}

export default getSupplementRequests
