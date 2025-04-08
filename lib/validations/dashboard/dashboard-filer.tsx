import { z } from "zod"

import { EDashboardPeriodLabel } from "@/lib/types/enums"
import { filterDateRangeSchema, filterEnumSchema } from "@/lib/zod"

export const dashboardFilterSchema = z.object({
  period: filterEnumSchema(
    EDashboardPeriodLabel,
    EDashboardPeriodLabel.DAILY.toString()
  ),
  dateRange: filterDateRangeSchema,
})

export type TDashboardFilterSchema = z.infer<typeof dashboardFilterSchema>
