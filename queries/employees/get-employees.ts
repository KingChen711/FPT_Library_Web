import "server-only"

import { http } from "@/lib/http"
import { type Employee } from "@/lib/types/models"

export type TGetEmployeesData = {
  sources: Employee[]
  pageIndex: number
  pageSize: number
  totalPage: number
}

export async function getEmployees(query: string): Promise<TGetEmployeesData> {
  try {
    const { data } = await http.get<TGetEmployeesData>(
      `/api/employees?${query}`,
      {
        next: {
          tags: ["employees"],
        },
      }
    )
    return data
  } catch {
    return {
      sources: [],
      pageIndex: 0,
      pageSize: 0,
      totalPage: 0,
    }
  }
}
