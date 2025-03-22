import { z } from "zod"

import { ENotificationType } from "@/lib/types/enums"
import {
  filterBooleanSchema,
  filterDateRangeSchema,
  filterEnumSchema,
} from "@/lib/zod"

export const filterNotificationSchema = z.object({
  notificationType: filterEnumSchema(ENotificationType),
  isPublic: filterBooleanSchema(),
  createDateRange: filterDateRangeSchema,
  email: z.string().optional(),
  createdBy: z.string().optional(),
})

export type TFilterNotificationSchema = z.infer<typeof filterNotificationSchema>

export const searchNotificationsSchema = z
  .object({
    search: z.string().catch(""),
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("5"),
    sort: z
      .enum([
        "Title",
        "-Title",
        "createDate",
        "-createDate",
        "createdBy",
        "-createdBy",
      ])
      .optional()
      .catch(undefined),
  })
  .and(filterNotificationSchema)

export type TSearchNotificationsSchema = z.infer<
  typeof searchNotificationsSchema
>
