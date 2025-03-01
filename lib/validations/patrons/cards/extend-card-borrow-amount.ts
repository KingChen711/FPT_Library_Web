import { z } from "zod"

export const extendCardBorrowAmountSchema = z.object({
  reason: z.string({ message: "min1" }).min(1, "min1"),
  maxItemOnceTime: z.coerce.number({ message: "min1" }).gte(3, "gte3"),
  libraryCardId: z.string(),
})

export type TExtendCardBorrowAmountSchema = z.infer<
  typeof extendCardBorrowAmountSchema
>
