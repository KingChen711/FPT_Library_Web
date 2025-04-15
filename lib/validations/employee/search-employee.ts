import { z } from "zod"

import { EGender } from "@/lib/types/enums"
import { filterDateRangeSchema, filterEnumSchema } from "@/lib/zod"

export const filterEmployeeSchema = z.object({
  dobRange: filterDateRangeSchema,
  createDateRange: filterDateRangeSchema,
  modifiedDateRange: filterDateRangeSchema,
  hireDateRange: filterDateRangeSchema,

  firstName: z.string().trim().optional().catch(""),
  employeeCode: z.string().trim().optional().catch(""),
  lastName: z.string().trim().optional().catch(""),
  gender: filterEnumSchema(EGender, undefined, true),
})

export type TFilterEmployeeSchema = z.infer<typeof filterEmployeeSchema>

export const searchEmployeesSchema = z
  .object({
    search: z.string().catch(""),
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("5"),
    isDeleted: z.enum(["true", "false"]).optional().catch(undefined),
    sort: z
      .enum([
        "email",
        "-email",
        "firstName",
        "-firstName",
        "lastName",
        "-lastName",
        "employeeCode",
        "-employeeCode",
        "phone",
        "-phone",
        "dob",
        "-dob",
        "address",
        "-address",
        "gender",
        "-gender",
        "hireDate",
        "-hireDate",
        "terminationDate",
        "-terminationDate",
        "isActive",
        "-isActive",
      ])
      .optional()
      .catch(undefined),
  })
  .and(filterEmployeeSchema)

export type TSearchEmployeeSchema = z.infer<typeof searchEmployeesSchema>
