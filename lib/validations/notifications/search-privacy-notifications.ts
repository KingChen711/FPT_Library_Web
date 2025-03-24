import { z } from "zod"

import { ENotificationType } from "@/lib/types/enums"
import { filterDateRangeSchema, filterEnumSchema } from "@/lib/zod"

export const filterNotificationPrivacySchema = z.object({
  notificationType: filterEnumSchema(ENotificationType),
  createDateRange: filterDateRangeSchema,
})

export type TFilterNotificationPrivacySchema = z.infer<
  typeof filterNotificationPrivacySchema
>

export const searchNotificationsPrivacySchema = z
  .object({
    search: z.string().catch(""),
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("5"),
    sort: z
      .enum(["Title", "-Title", "createDate", "-createDate"])
      .optional()
      .catch(undefined),
  })
  .and(filterNotificationPrivacySchema)

export type TSearchNotificationsPrivacySchema = z.infer<
  typeof searchNotificationsPrivacySchema
>
