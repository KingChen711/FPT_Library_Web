import { z } from "zod"

export const searchNotificationsSchema = z.object({
  search: z.string().catch(""),
  pageIndex: z.coerce.number().min(1).catch(1),
  pageSize: z.enum(["10", "30", "50", "100"]).catch("10"),
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

export type TSearchNotificationsSchema = z.infer<
  typeof searchNotificationsSchema
>
