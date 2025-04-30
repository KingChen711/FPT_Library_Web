import { z } from "zod"

import { EClosureType } from "@/lib/types/enums"
import { isValidDate } from "@/lib/utils"

export const mutateClosureDaySchema = z
  .object({
    type: z.nativeEnum(EClosureType),
    day: z.coerce.number({ message: "min1" }).gte(1, "gte1").lte(31, "lte31"),
    month: z.coerce.number({ message: "min1" }).gte(1, "gte1").lte(12, "lte12"),
    year: z.coerce.number({ message: "min1" }).gte(0, "gte0").optional(),
    vieDescription: z.string({ message: "min1" }).min(1, "min1"),
    engDescription: z.string({ message: "min1" }).min(1, "min1"),
  })
  .refine((data) => data.type === EClosureType.ANNUAL || data.year, {
    message: "min1",
    path: ["year"],
  })
  .refine((data) => isValidDate(data.day, data.month, data.year), {
    message: "inValidDay",
    path: ["day"],
  })

export type TMutateClosureDaySchema = z.infer<typeof mutateClosureDaySchema>
