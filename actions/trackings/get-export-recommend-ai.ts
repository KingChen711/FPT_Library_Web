"use server"

import { auth } from "@/queries/auth"

import { http } from "@/lib/http"
import { type TAIRecommends } from "@/hooks/trackings/use-ai-recommends"

export async function getExportRecommendAI(
  trackingId: number
): Promise<TAIRecommends> {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TAIRecommends>(
      `/api/management/warehouse-trackings/${trackingId}/supplement-details`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          pageSize: 1000,
        },
      }
    )

    return (
      data || {
        sources: [],
        pageIndex: 1,
        pageSize: 10,
        totalActualItem: 0,
        totalPage: 0,
      }
    )
  } catch {
    return {
      sources: [],
      pageIndex: 1,
      pageSize: 10,
      totalActualItem: 0,
      totalPage: 0,
    }
  }
}
