import { z } from "zod"

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
    dobRange: z.array(z.string().trim()).optional().catch([]),
    dateOfDeathRange: z.array(z.string().trim()).optional().catch([]),
    createDateRange: z.array(z.string().trim()).optional().catch([]),
    modifiedDateRange: z.array(z.string().trim()).optional().catch([]),
    authorCode: z.string().optional().catch(""),
    nationality: z.string().optional().catch(""),
    isActive: z.string().optional().catch(""),
    tab: z.enum(["Active", "Deleted"]).catch("Active"),
    isDeleted: z.boolean().optional(),
    isTrained: z
      .enum(["true", "false"])
      .optional()
      .catch(undefined)
      .transform((data) => (data === undefined ? undefined : data === "true")),
  })
  .transform((data) => {
    data.isDeleted = data.tab === "Deleted"
    return data
  })

export type TSearchAuthorSchema = z.infer<typeof searchAuthorsSchema>
