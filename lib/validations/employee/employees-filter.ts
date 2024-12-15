import { z } from "zod"

export const employeesFilterSchema = z.object({
  employeeCode: z.string().trim().optional(),
  roleId: z.string().trim().optional(),
  isActive: z.boolean().optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  dobRange: z.array(z.string().trim()).optional(),
  createDateRange: z.array(z.string().trim()).optional(),
  modifieldDateRange: z.array(z.string().trim()).optional(),
  hireDateRange: z.array(z.string().trim()).optional(),
  pageIndex: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().trim().optional(),
})

export type TEmployeesFilterSchema = z.infer<typeof employeesFilterSchema>
