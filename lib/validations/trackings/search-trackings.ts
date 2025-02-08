import { z } from "zod"

import { ETrackingStatus, ETrackingType } from "@/lib/types/enums"

export const filterTrackingSchema = z.object({
  trackingType: z.nativeEnum(ETrackingType).optional().catch(undefined),
  status: z.nativeEnum(ETrackingStatus).optional().catch(undefined),
  totalItemRange: z.array(z.coerce.number().or(z.null())).catch([null, null]),
  totalAmountRange: z.array(z.coerce.number().or(z.null())).catch([null, null]),
  entryDateRange: z.array(z.date().or(z.null())).catch([null, null]),
  expectedReturnDateRange: z.array(z.date().or(z.null())).catch([null, null]),
  actualReturnDateRange: z.array(z.date().or(z.null())).catch([null, null]),
  createdAtRange: z.array(z.date().or(z.null())).catch([null, null]),
  updatedAtRange: z.array(z.date().or(z.null())).catch([null, null]),
})

export type TFilterTrackingSchema = z.infer<typeof filterTrackingSchema>

export const searchTrackingsSchema = z
  .object({
    search: z.string().catch(""),
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("10"),
    sort: z
      .enum([
        "SupplierName",
        "-SupplierName",
        "ReceiptNumber",
        "-ReceiptNumber",
        "TotalItem",
        "-TotalItem",
        "TotalAmount",
        "-TotalAmount",
        "EntryDate",
        "-EntryDate",
        "ExpectedReturnDate",
        "-ExpectedReturnDate",
        "ActualReturnDate",
        "-ActualReturnDate",
        "CreatedAt",
        "-CreatedAt",
        "UpdatedAt",
        "-UpdatedAt",
      ])
      .optional()
      .catch(undefined),
  })
  .and(filterTrackingSchema)

export type TSearchTrackingsSchema = z.infer<typeof searchTrackingsSchema>
