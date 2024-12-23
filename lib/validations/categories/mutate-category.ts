import { z } from "zod"

export const mutateCategorySchema = z.object({
  englishName: z
    .string()
    .trim()
    .min(1, "min1")
    .regex(
      /^([A-Z][a-z]*)(\s[A-Z][a-z]*)*$/,
      "each word should start with uppercase letter"
    ),
  vietnameseName: z
    .string()
    .trim()
    .min(1, "min1")
    .regex(
      /^([A-Z][a-z]*)(\s[A-Z][a-z]*)*$/,
      "each word should start with uppercase letter"
    ),
  description: z.string().trim(),
})

export type TMutateCategorySchema = z.infer<typeof mutateCategorySchema>
