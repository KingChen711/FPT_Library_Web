import { DateTime } from "luxon"
import { z } from "zod"

export const suspendCardSchema = z.object({
  reason: z.string({ message: "min1" }).min(1, "min1"),
  libraryCardId: z.string(),
  suspensionEndDate: z
    .date({ message: "min1" })
    .refine((data) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return data >= today
    }, "dateGteToday")
    .transform((data) =>
      DateTime.fromJSDate(data)
        .setZone("UTC", { keepLocalTime: true })
        .toJSDate()
    ),
})

export type TSuspendCardSchema = z.infer<typeof suspendCardSchema>
