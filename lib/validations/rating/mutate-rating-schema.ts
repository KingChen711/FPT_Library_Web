import { z } from "zod"

export const mutateRatingSchema = z.object({
  libraryItemId: z.number(),
  ratingValue: z.number(),
  reviewText: z
    .string()
    .trim()
    .optional()
    .transform((data) => (data === "" ? undefined : data)),
})

export type TMutateRatingSchema = z.infer<typeof mutateRatingSchema>
