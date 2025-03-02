import { DateTime } from "luxon"
import { z } from "zod"

import { ENotificationType, EVisibility } from "@/lib/types/enums"

export const visibilityOptions = [
  "All",
  EVisibility.PUBLIC,
  EVisibility.PRIVATE,
] as const

export const filterNotificationSchema = z.object({
  notificationType: z.nativeEnum(ENotificationType).optional().catch(undefined),
  visibility: z.enum(visibilityOptions).catch("All"),
  createDateRange: z
    .array(z.date().or(z.null()))
    .transform((data) => {
      data.forEach((date, i) => {
        if (date) {
          data[i] = DateTime.fromJSDate(date)
            .setZone("UTC", { keepLocalTime: true })
            .toJSDate()
        }
      })
      return data
    })
    .catch([null, null]),
})

export type TFilterNotificationSchema = z.infer<typeof filterNotificationSchema>

export const searchNotificationsSchema = z
  .object({
    search: z.string().catch(""),
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("10"),
    sort: z
      .enum([
        "NotificationPolicyId",
        "-NotificationPolicyId",
        "ConditionType",
        "-ConditionType",
        "NotificationAmountPerDay",
        "-NotificationAmountPerDay",
        "FixedNotificationAmount",
        "-FixedNotificationAmount",
      ])
      .optional()
      .catch(undefined),
  })
  .and(filterNotificationSchema)

export type TSearchNotificationsSchema = z.infer<
  typeof searchNotificationsSchema
>
