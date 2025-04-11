import { z } from "zod"

import { filterDateRangeSchema } from "@/lib/zod"

export const filterAuthorSchema = z.object({
  authorCode: z.string().trim().optional(),
  nationality: z.string().trim().optional(),
  dobRange: filterDateRangeSchema,
  dateOfDeathRange: filterDateRangeSchema,
  createDateRange: filterDateRangeSchema,
  modifiedDateRange: filterDateRangeSchema,
})

export type TFilterAuthorSchema = z.infer<typeof filterAuthorSchema>

export const searchAuthorsSchema = z
  .object({
    search: z.string().catch(""),
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("5"),
    sort: z
      .enum([
        "fullName",
        "-fullName",
        "authorCode",
        "-authorCode",
        "biography",
        "-biography",
        "dob",
        "-dob",
        "dateOfDeath",
        "-dateOfDeath",
        "nationality",
        "-nationality",
        "createDate",
        "-createDate",
        "updateDate",
        "-updateDate",
      ])
      .optional()
      .catch(undefined),

    isActive: z.string().optional().catch(""),
    tab: z.enum(["Active", "Deleted"]).catch("Active"),
    isDeleted: z.boolean().optional(),
  })
  .and(filterAuthorSchema)
  .transform((data) => {
    data.isDeleted = data.tab === "Deleted"
    return data
  })

export type TSearchAuthorSchema = z.infer<typeof searchAuthorsSchema>
