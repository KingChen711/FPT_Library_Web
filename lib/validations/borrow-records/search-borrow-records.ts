import { z } from "zod"

import { EBorrowType } from "@/lib/types/enums"
import { filterDateRangeSchema, filterEnumSchema } from "@/lib/zod"

export const filterBorrowRecordSchema = z.object({
  borrowType: filterEnumSchema(EBorrowType),

  borrowDateRange: filterDateRangeSchema,

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

export type TFilterBorrowRecordSchema = z.infer<typeof filterBorrowRecordSchema>

export const searchBorrowRecordsSchema = z
  .object({
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("5"),
    search: z.string().catch(""),
    sort: z
      .enum([
        "BorrowDate",
        "-BorrowDate",
        "TotalRecordItem",
        "-TotalRecordItem",
      ])
      .optional()
      .catch(undefined),
  })
  .and(filterBorrowRecordSchema)

export type TSearchBorrowRecordsSchema = z.infer<
  typeof searchBorrowRecordsSchema
>
