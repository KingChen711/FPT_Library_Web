import { z } from "zod"

import { EBorrowRequestStatus, ESearchType } from "@/lib/types/enums"
import { filterDateRangeSchema, filterEnumSchema } from "@/lib/zod"

export const filterBorrowRequestsSchema = z.object({
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

export type TFilterBorrowRequestsSchema = z.infer<
  typeof filterBorrowRequestsSchema
>

export const searchBorrowRequestsSchema = z
  .object({
    search: z.string().catch(""),
    searchType: filterEnumSchema(ESearchType),
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("10"),
    sort: z.enum(["Demo", "-Demo"]).optional().catch(undefined),
  })
  .and(filterBorrowRequestsSchema)

export type TSearchBorrowRequestsSchema = z.infer<
  typeof searchBorrowRequestsSchema
>
