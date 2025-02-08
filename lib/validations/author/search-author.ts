import { z } from "zod"

export const searchAuthorsSchema = z.object({
  search: z.string().catch(""),
  pageIndex: z.coerce.number().min(1).catch(1),
  pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("5"),
  isDeleted: z.enum(["true", "false"]).optional().catch(undefined),
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
  dobRange: z.array(z.string().trim()).optional().catch([]),
  dateOfDeathRange: z.array(z.string().trim()).optional().catch([]),
  createDateRange: z.array(z.string().trim()).optional().catch([]),
  modifiedDateRange: z.array(z.string().trim()).optional().catch([]),
  authorCode: z.string().optional().catch(""),
  isActive: z.string().optional().catch(""),
  nationality: z.string().optional().catch(""),
})

export type TSearchAuthorSchema = z.infer<typeof searchAuthorsSchema>
