import { z } from "zod"

import { EBorrowDigitalStatus } from "@/lib/types/enums"
import {
  filterBooleanSchema,
  filterDateRangeSchema,
  filterEnumSchema,
} from "@/lib/zod"

export const filterBorrowDigitalManagementSchema = z.object({
  isExtended: filterBooleanSchema(),
  status: filterEnumSchema(EBorrowDigitalStatus),
  registerDateRange: filterDateRangeSchema,
  expiryDateRange: filterDateRangeSchema,

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

export type TFilterBorrowDigitalManagementSchema = z.infer<
  typeof filterBorrowDigitalManagementSchema
>

export const searchBorrowDigitalsManagementSchema = z
  .object({
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("5"),
    search: z.string().catch(""),
    sort: z
      .enum(["RegisterDate", "-RegisterDate", "ExpiryDate", "-ExpiryDate"])
      .optional()
      .catch(undefined),
  })
  .and(filterBorrowDigitalManagementSchema)

export type TSearchBorrowDigitalsManagementSchema = z.infer<
  typeof searchBorrowDigitalsManagementSchema
>
