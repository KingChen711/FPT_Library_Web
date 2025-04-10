import { z } from "zod"

export const searchRecommendSchema = z.object({
  includeTitle: z.enum(["true", "false"]).catch("true"),
  includeAuthor: z.enum(["true", "false"]).catch("true"),
  includeGenres: z.enum(["true", "false"]).catch("true"),
  includeTopicalTerms: z.enum(["true", "false"]).catch("false"),
  limitWorksOfAuthor: z.enum(["true", "false"]).catch("true"),
  bestRecommend: z.enum(["true", "false"]).catch("true"),
})

export type TSearchRecommendSchema = z.infer<typeof searchRecommendSchema>
