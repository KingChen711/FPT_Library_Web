import { z } from "zod"

import { ETrackingStatus } from "@/lib/types/enums"
import {
  filterDateRangeSchema,
  filterEnumSchema,
  filterNumRangeSchema,
} from "@/lib/zod"

export const filterSupplementRequestSchema = z.object({
  status: filterEnumSchema(ETrackingStatus),

  totalItemRange: filterNumRangeSchema,
  totalAmountRange: filterNumRangeSchema,

  entryDateRange: filterDateRangeSchema,
  expectedReturnDateRange: filterDateRangeSchema,
  actualReturnDateRange: filterDateRangeSchema,
  createdAtRange: filterDateRangeSchema,
  updatedAtRange: filterDateRangeSchema,
  dataFinalizationDateRange: filterDateRangeSchema,
})

export type TFilterSupplementRequestSchema = z.infer<
  typeof filterSupplementRequestSchema
>

export const searchSupplementRequestsSchema = z
  .object({
    search: z.string().catch(""),
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("5"),
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
        "DataFinalizationDate",
        "-DataFinalizationDate",
      ])
      .optional()
      .catch(undefined),
  })
  .and(filterSupplementRequestSchema)

export type TSearchSupplementRequestsSchema = z.infer<
  typeof searchSupplementRequestsSchema
>
