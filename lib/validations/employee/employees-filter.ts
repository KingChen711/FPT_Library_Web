import { z } from "zod"

export const employeesFilterSchema = z.object({
  employeeCode: z.string().optional(),
  roleId: z.string().optional(),
  isActive: z.boolean().optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  dobRange: z.array(z.string()).optional(),
  createDateRange: z.array(z.string()).optional(),
  modifieldDateRange: z.array(z.string()).optional(),
  hireDateRange: z.array(z.string()).optional(),
  pageIndex: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
})

export type TEmployeesFilterSchema = z.infer<typeof employeesFilterSchema>
