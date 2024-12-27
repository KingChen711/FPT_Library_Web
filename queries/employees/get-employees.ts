import { http } from "@/lib/http"

import "server-only"

import { type Employee } from "@/lib/types/models"
import { type TSearchEmployeeSchema } from "@/lib/validations/employee/search-employee"

import { auth } from "../auth"

export type Employees = Employee[]

export type TGetEmployeesData = {
  sources: Employee[]
  pageIndex: number
  pageSize: number
  totalPage: number
  totalActualItem: number
}

const getEmployees = async (
  searchParams: TSearchEmployeeSchema
): Promise<TGetEmployeesData> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TGetEmployeesData>(
      `/api/management/employees`,
      {
        next: {
          tags: ["employees"],
        },
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams,
      }
    )

    return data
  } catch {
    return {
      sources: [],
      pageIndex: 0,
      pageSize: 0,
      totalPage: 0,
      totalActualItem: 0,
    }
  }
}

export default getEmployees
