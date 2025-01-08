import { z } from "zod"

export const searchBooksSchema = z.object({
  search: z.string().catch(""),
  pageIndex: z.coerce.number().min(1).catch(1),
  pageSize: z.enum(["10", "30", "50", "100"]).catch("10"),
  sort: z.enum(["Test"]).optional().catch(undefined),
})

export type TSearchBooksSchema = z.infer<typeof searchBooksSchema>
