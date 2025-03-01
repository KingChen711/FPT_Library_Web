import { z } from "zod"

export const archiveCardSchema = z.object({
  archiveReason: z.string({ message: "min1" }).min(1, "min1"),
  libraryCardId: z.string(),
})

export type TArchiveCardSchema = z.infer<typeof archiveCardSchema>
