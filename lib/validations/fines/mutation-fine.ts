import { z } from "zod"

export const mutateFineSchema = z.object({
  conditionType: z.string().trim().min(1, "min1"),
  fineAmountPerDay: z.coerce.number(),
  fixedFineAmount: z.coerce.number(),
  description: z.string().trim().optional(),
})

export type TMutateFineSchema = z.infer<typeof mutateFineSchema>
