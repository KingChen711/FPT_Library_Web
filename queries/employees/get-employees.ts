import { http } from "@/lib/http"

import "server-only"

import { format } from "date-fns"

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
    const formatDate = (d: Date) => format(d, "yyyy-MM-dd")
    const { data } = await http.get<TGetEmployeesData>(
      `/api/management/employees`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          ...searchParams,
          createDateRange:
            JSON.stringify(searchParams.createDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.createDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          dobRange:
            JSON.stringify(searchParams.dobRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.dobRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          hireDateRange:
            JSON.stringify(searchParams.hireDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.hireDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          modifiedDateRange:
            JSON.stringify(searchParams.modifiedDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.modifiedDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
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
      totalActualItem: 0,
    }
  }
}

export default getEmployees
