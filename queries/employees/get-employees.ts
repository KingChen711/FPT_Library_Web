import "server-only"

import { http } from "@/lib/http"
import { type Employee } from "@/lib/types/models"

import { auth } from "../auth"

export type TGetEmployeesData = {
  sources: Employee[]
  pageIndex: number
  pageSize: number
  totalPage: number
  count: number
}

export async function getEmployees(query: string): Promise<TGetEmployeesData> {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TGetEmployeesData>(
      `/api/management/employees?${query}`,
      {
        next: {
          tags: ["employees"],
        },
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )
    return { ...data, count: data.sources.length }
  } catch {
    return {
      sources: [],
      pageIndex: 0,
      pageSize: 0,
      totalPage: 0,
      count: 0,
    }
  }
}
