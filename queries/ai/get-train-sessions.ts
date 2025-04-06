import { http } from "@/lib/http"

import "server-only"

import { format } from "date-fns"

import { type TrainSession } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchTrainSessionsSchema } from "@/lib/validations/ai/search-train-sessions"

import { auth } from "../auth"

export type TrainSessions = TrainSession[]

const getTrainSessions = async (
  searchParams: TSearchTrainSessionsSchema
): Promise<Pagination<TrainSessions>> => {
  const { getAccessToken } = auth()
  try {
    const formatDate = (d: Date) => format(d, "yyyy-MM-dd")
    const { data } = await http.get<Pagination<TrainSessions>>(
      `/api/management/sessions`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          ...searchParams,

          trainDateRange:
            JSON.stringify(searchParams.trainDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.trainDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
        },
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
}

export default getTrainSessions
