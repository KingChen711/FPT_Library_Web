import { z } from "zod"

import { filterBooleanSchema } from "@/lib/zod"

export const searchRecommendSchema = z.object({
  pageIndex: z.coerce.number().min(1).catch(1),
  pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("10"),
  includeTitle: filterBooleanSchema("true"),
  includeAuthor: filterBooleanSchema("true"),
  includeGenres: filterBooleanSchema("true"),
  includeTopicalTerms: filterBooleanSchema("false"),
  limitWorksOfAuthor: filterBooleanSchema("true"),
  bestRecommend: filterBooleanSchema("true"),
})

export type TSearchRecommendSchema = z.infer<typeof searchRecommendSchema>
