import { z } from "zod"

import { EFineType } from "@/lib/types/enums"

export const mutateFineSchema = z.object({
  finePolicyTitle: z.string().trim().min(1, "min1"),
  conditionType: z.nativeEnum(EFineType),
  fineAmountPerDay: z.coerce.number(),
  fixedFineAmount: z.coerce.number(),
  description: z.string().trim().optional(),
})

export type TMutateFineSchema = z.infer<typeof mutateFineSchema>
