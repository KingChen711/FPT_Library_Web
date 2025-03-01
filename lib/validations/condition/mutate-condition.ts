import { z } from "zod"

export const mutateConditionSchema = z.object({
  englishName: z.string().trim().min(1, "min1"),
  vietnameseName: z.string().trim().min(1, "min1"),
})

export type TMutateConditionSchema = z.infer<typeof mutateConditionSchema>
