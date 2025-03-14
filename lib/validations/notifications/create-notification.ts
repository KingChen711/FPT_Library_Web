import { z } from "zod"

import { ENotificationType } from "@/lib/types/enums"

export const createNotificationSchema = z
  .object({
    title: z.string().trim().min(1, "min1"),
    message: z.string().trim().min(1, "min1"),
    isPublic: z.coerce.boolean(),
    createBy: z.string().trim(),
    notificationType: z.nativeEnum(ENotificationType),
    listRecipient: z.array(z.string().trim()),
  })
  .refine(
    (data) => {
      return data.isPublic || data.listRecipient.length > 0
    },
    {
      message: "atLeastOneRecipient",
      path: ["listRecipient"],
    }
  )

export type TCreateNotificationSchema = z.infer<typeof createNotificationSchema>
