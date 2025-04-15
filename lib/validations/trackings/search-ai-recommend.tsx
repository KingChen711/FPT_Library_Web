import { z } from "zod"

import { filterNumRangeSchema } from "@/lib/zod"

export const filterAIRecommendsSchema = z.object({
  pageCountRange: filterNumRangeSchema,
  averageRatingRange: filterNumRangeSchema,
  ratingsCountRange: filterNumRangeSchema,
})

export type TFilterAIRecommendsSchema = z.infer<typeof filterAIRecommendsSchema>

export const searchAIRecommendsSchema = z
  .object({
    search: z.string().catch(""),
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("5"),
    sort: z
      .enum([
        "Title",
        "-Title",
        "Author",
        "-Author",
        "Publisher",
        "-Publisher",
        "PublishedDate",
        "-PublishedDate",
        "ISBN",
        "-ISBN",
        "PageCount",
        "-PageCount",
        "EstimatedPrice",
        "-EstimatedPrice",
        "Language",
        "-Language",
        "Categories",
        "-Categories",
        "AverageRating",
        "-AverageRating",
        "RatingsCount",
        "-RatingsCount",
      ])
      .optional()
      .catch(undefined),
  })
  .and(filterAIRecommendsSchema)

export type TSearchAIRecommendsSchema = z.infer<typeof searchAIRecommendsSchema>
