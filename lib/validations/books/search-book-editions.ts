import { z } from "zod"

export const searchBookEditionsSchema = z.object({
  search: z.string().catch(""),
  pageIndex: z.coerce.number().min(1).catch(1),
  pageSize: z.enum(["10", "30", "50", "100"]).catch("10"),
  sort: z
    .enum([
      "BookId",
      "-BookId",
      "BookEditionId",
      "-BookEditionId",
      "EditionNumber",
      "-EditionNumber",
      "PublicationYear",
      "-PublicationYear",
    ])
    .optional()
    .catch(undefined),
})

export type TSearchBookEditionsSchema = z.infer<typeof searchBookEditionsSchema>
