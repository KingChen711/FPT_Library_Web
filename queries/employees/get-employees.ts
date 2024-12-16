import "server-only"

import { http } from "@/lib/http"
import { type Employee } from "@/lib/types/models"

export type TGetEmployeesData = {
  sources: Employee[]
  pageIndex: number
  pageSize: number
  totalPage: number
  count: number
}

export async function getEmployees(query: string): Promise<TGetEmployeesData> {
  console.log(`/api/employees?${query}`)
  try {
    const { data } = await http.get<TGetEmployeesData>(
      `/api/employees?${query}`,
      {
        next: {
          tags: ["employees"],
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
