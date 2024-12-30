import { z } from "zod"

export const searchEmployeesSchema = z.object({
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
  dobRange: z.array(z.string().trim()).optional().catch([]),
  createDateRange: z.array(z.string().trim()).optional().catch([]),
  modifiedDateRange: z.array(z.string().trim()).optional().catch([]),
  hireDateRange: z.array(z.string().trim()).optional().catch([]),
  terminationDateRange: z.array(z.string().trim()).optional().catch([]),
  roleId: z.string().optional().catch(""),
  firstName: z.string().optional().catch(""),
  lastName: z.string().optional().catch(""),
  email: z.string().optional().catch(""),
  phone: z.string().optional().catch(""),
  employeeCode: z.string().optional().catch(""),
  isActive: z.string().optional().catch(""),
  address: z.string().optional().catch(""),
})

export type TSearchEmployeeSchema = z.infer<typeof searchEmployeesSchema>
