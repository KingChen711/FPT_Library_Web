import { z } from "zod"

export const searchBorrowRequestsSchema = z.object({
  pageIndex: z.coerce.number().min(1).catch(1),
  pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("10"),
})

export type TSearchBorrowRequestsSchema = z.infer<
  typeof searchBorrowRequestsSchema
>
