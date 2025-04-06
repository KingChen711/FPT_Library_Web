import { z } from "zod"

import { ETrainingStatus } from "@/lib/types/enums"
import { filterDateRangeSchema, filterEnumSchema } from "@/lib/zod"

export const filterTrainSessionSchema = z.object({
  trainingStatus: filterEnumSchema(ETrainingStatus),
  trainDateRange: filterDateRangeSchema,
})

export type TFilterTrainSessionSchema = z.infer<typeof filterTrainSessionSchema>

export const searchTrainSessionsSchema = z
  .object({
    search: z.string().catch(""),
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("5"),
    sort: z
      .enum([
        "TrainDate",
        "-TrainDate",
        "TotalTrainedItem",
        "-TotalTrainedItem",
        "TrainingPercentage",
        "-TrainingPercentage",
      ])
      .optional()
      .catch(undefined),
  })
  .and(filterTrainSessionSchema)

export type TSearchTrainSessionsSchema = z.infer<
  typeof searchTrainSessionsSchema
>
