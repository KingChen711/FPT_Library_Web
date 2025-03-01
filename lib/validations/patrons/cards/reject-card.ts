import { z } from "zod"

export const rejectCardSchema = z.object({
  rejectReason: z.string({ message: "min1" }).min(1, "min1"),
  libraryCardId: z.string(),
})

export type TRejectCardSchema = z.infer<typeof rejectCardSchema>
