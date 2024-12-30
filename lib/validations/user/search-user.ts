import { z } from "zod"

export const searchUsersSchema = z.object({
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
      "userCode",
      "-userCode",
      "phone",
      "-phone",
      "dob",
      "-dob",
      "address",
      "-address",
      "gender",
      "-gender",
      "createDate",
      "-createDate",
      "modifiedDate",
      "-modifiedDate",
      "modifiedBy",
      "-modifiedBy",
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
  userCode: z.string().optional().catch(""),
  isActive: z.string().optional().catch(""),
  address: z.string().optional().catch(""),
})

export type TSearchUsersSchema = z.infer<typeof searchUsersSchema>
