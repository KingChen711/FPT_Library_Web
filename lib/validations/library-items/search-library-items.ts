import { z } from "zod"

export const searchLibraryItemsSchema = z.object({
  search: z.string().catch(""),
  pageIndex: z.coerce.number().min(1).catch(1),
  pageSize: z.enum(["5", "6", "10", "30", "50", "100"]).catch("5"),
  authorId: z.coerce.number().optional().catch(undefined),
})

export type TSearchLibraryItemSchema = z.infer<typeof searchLibraryItemsSchema>
