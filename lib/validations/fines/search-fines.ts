import { z } from "zod"

export const searchFinesSchema = z.object({
  search: z.string().catch(""),
  pageIndex: z.coerce.number().min(1).catch(1),
  pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("5"),
  sort: z
    .enum([
      "FinePolicyId",
      "-FinePolicyId",
      "FinePolicyTitle",
      "-FinePolicyTitle",
      "ConditionType",
      "-ConditionType",
      "ChargePct",
      "-ChargePct",
      "ProcessingFee",
      "-ProcessingFee",
      "DailyRate",
      "-DailyRate",
    ])

    .catch("-ConditionType"),
})

export type TSearchFinesSchema = z.infer<typeof searchFinesSchema>
