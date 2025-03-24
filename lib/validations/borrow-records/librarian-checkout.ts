import { z } from "zod"

import { EBorrowType } from "@/lib/types/enums"

export const librarianCheckoutSchema = z.object({
  //client only
  libraryCardBarcode: z.string(),
  //client only
  patron: z.any(),

  libraryCardId: z.string(),
  borrowRecordDetails: z.array(
    z.object({
      libraryItemInstanceId: z.number(),
    })
  ),
  borrowType: z.nativeEnum(EBorrowType), //only NEW and ADDITIONAL are used for this form

  dueDate: z.date(), //TODO: only select time in date, TODO: validate time in date
})

export type TLibrarianCheckoutSchema = z.infer<typeof librarianCheckoutSchema>
