import { DateTime } from "luxon"
import { z } from "zod"

import { EBorrowType } from "@/lib/types/enums"

export const librarianCheckoutSchema = z
  .object({
    //client only
    libraryCardBarcode: z.string(),

    libraryCardId: z.string(),
    borrowRecordDetails: z.array(
      z.object({
        libraryItemInstanceId: z.number(),
      })
    ),
    borrowType: z.nativeEnum(EBorrowType),

    dueDate: z.date({ message: "min1" }).optional(),
  })
  .refine((data) => data.borrowType === EBorrowType.TAKE_HOME || data.dueDate, {
    message: "min1",
    path: ["dueDate"],
  })
  .refine(
    (data) =>
      data.borrowType === EBorrowType.TAKE_HOME ||
      (data.dueDate && data.dueDate > new Date()),
    {
      message: "mustAfterThanNow",
      path: ["dueDate"],
    }
  )
  .transform((data) => {
    if (data.borrowType === EBorrowType.TAKE_HOME) {
      data.dueDate = undefined
      return data
    }
    data.dueDate = DateTime.fromJSDate(data.dueDate!)
      .setZone("UTC", { keepLocalTime: true })
      .toJSDate()
    return data
  })

export type TLibrarianCheckoutSchema = z.infer<typeof librarianCheckoutSchema>
