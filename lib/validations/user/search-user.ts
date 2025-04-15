import { z } from "zod"

import { EGender } from "@/lib/types/enums"
import { filterDateRangeSchema, filterEnumSchema } from "@/lib/zod"

export const filterUserSchema = z.object({
  dobRange: filterDateRangeSchema,
  createDateRange: filterDateRangeSchema,
  modifiedDateRange: filterDateRangeSchema,

  firstName: z.string().trim().optional().catch(""),
  lastName: z.string().trim().optional().catch(""),
  gender: filterEnumSchema(EGender, undefined, true),
})

export type TFilterUserSchema = z.infer<typeof filterUserSchema>

export const searchUsersSchema = z
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
  })
  .and(filterUserSchema)

export type TSearchUsersSchema = z.infer<typeof searchUsersSchema>
