import "server-only"

import { http } from "@/lib/http"

import { auth } from "../auth"

export async function getMaxGroupTrain(): Promise<number> {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<number | null>(
      `/management/groups/available-groups-to-train`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    return data || 5
  } catch {
    return 5
  }
}
