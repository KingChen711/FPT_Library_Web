import { z } from "zod"

import { EBorrowRequestStatus } from "@/lib/types/enums"
import { filterDateRangeSchema, filterEnumSchema } from "@/lib/zod"

export const filterBorrowRequestSchema = z.object({
  status: filterEnumSchema(EBorrowRequestStatus),

  requestDateRange: filterDateRangeSchema,
  expirationDateRange: filterDateRangeSchema,
  cancelledAtRange: filterDateRangeSchema,

  f: z
    .array(z.string())
    .or(z.string())
    .transform((data) => (Array.isArray(data) ? data : [data]))
    .catch([]),
  o: z
    .array(z.string())
    .or(z.string())
    .transform((data) => (Array.isArray(data) ? data : [data]))
    .catch([]),
  v: z
    .array(z.string())
    .or(z.string())
    .transform((data) => (Array.isArray(data) ? data : [data]))
    .catch([]),
})

export type TFilterBorrowRequestSchema = z.infer<
  typeof filterBorrowRequestSchema
>

export const searchBorrowRequestsSchema = z
  .object({
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("5"),
    search: z.string().catch(""),
    sort: z
      .enum([
        "TotalRequestItem",
        "-TotalRequestItem",
        "RequestDate",
        "-RequestDate",
        "ExpirationDate",
        "-ExpirationDate",
        "CancelledAt",
        "-CancelledAt",
      ])
      .optional()
      .catch(undefined),
  })
  .and(filterBorrowRequestSchema)

export type TSearchBorrowRequestsSchema = z.infer<
  typeof searchBorrowRequestsSchema
>
