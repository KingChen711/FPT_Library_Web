import { z } from "zod"

import { ECategoryPrefix } from "@/lib/types/enums"

export const mutateCategorySchema = z.object({
  englishName: z.string().trim().min(1, "min1"),
  vietnameseName: z.string().trim().min(1, "min1"),
  description: z.string().trim(),
  prefix: z.nativeEnum(ECategoryPrefix),
})

export type TMutateCategorySchema = z.infer<typeof mutateCategorySchema>
