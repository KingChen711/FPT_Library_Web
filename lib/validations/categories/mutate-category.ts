import { z } from "zod"

export const mutateCategorySchema = z.object({
  englishName: z.string().trim().min(1, "min1"),
  vietnameseName: z.string().trim().min(1, "min1"),
  description: z.string().trim(),
  prefix: z.string(),
  isAllowAITraining: z.boolean(),
  totalBorrowDays: z.coerce.number({ message: "min1" }).gt(0, "gt0"),
})

export type TMutateCategorySchema = z.infer<typeof mutateCategorySchema>
