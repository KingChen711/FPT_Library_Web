import { z } from "zod"

export const searchShelvesSchema = z.object({
  pageIndex: z.coerce.number().min(1).catch(1),
  pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("5"),
  search: z.string().catch(""),
  sort: z
    .enum([
      "ShelfNumber",
      "-ShelfNumber",
      "ClassificationNumberRangeFrom",
      "-ClassificationNumberRangeFrom",
    ])
    .catch("ShelfNumber"),
})

export type TSearchShelvesSchema = z.infer<typeof searchShelvesSchema>
