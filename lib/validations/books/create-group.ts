import { z } from "zod"

export const createGroupSchema = z.object({
  classificationNumber: z.string().trim().min(1, "min1"),
  cutterNumber: z.string().trim().min(1, "min1"),
  title: z.string().trim().min(1, "min1"),
  author: z.string().trim().min(1, "min1"),
  topicalTerms: z
    .string()
    .trim()
    .optional()
    .transform((data) => (data === "" ? undefined : data)),
  subTitle: z
    .string()
    .trim()
    .optional()
    .transform((data) => (data === "" ? undefined : data)),
})

export type TCreateGroupSchema = z.infer<typeof createGroupSchema>
