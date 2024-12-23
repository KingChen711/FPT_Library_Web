import { z } from "zod"

export const searchFinesSchema = z.object({
  search: z.string().catch(""),
  pageIndex: z.coerce.number().min(1).catch(1),
  pageSize: z.enum(["10", "30", "50", "100"]).catch("10"),
  sort: z
    .enum([
      "FinePolicyId",
      "-FinePolicyId",
      "ConditionType",
      "-ConditionType",
      "FineAmountPerDay",
      "-FineAmountPerDay",
      "FixedFineAmount",
      "-FixedFineAmount",
    ])
    .optional()
    .catch(undefined),
})

export type TSearchFinesSchema = z.infer<typeof searchFinesSchema>
