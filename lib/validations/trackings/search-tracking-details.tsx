import { z } from "zod"

import { ESearchType, EStockTransactionType } from "@/lib/types/enums"
import { filterBooleanSchema, filterEnumSchema } from "@/lib/zod"

export const filterTrackingDetailsSchema = z.object({
  itemName: z
    .string()
    .optional()
    .catch(undefined)
    .transform((data) => data || undefined),
  itemTotal: z.coerce
    .number()
    .optional()
    .catch(undefined)
    .transform((data) => data ?? undefined),
  unitPrice: z.coerce
    .number()
    .optional()
    .catch(undefined)
    .transform((data) => data ?? undefined),
  totalAmount: z.coerce
    .number()
    .optional()
    .catch(undefined)
    .transform((data) => data ?? undefined),
  isbn: z
    .string()
    .optional()
    .catch(undefined)
    .transform((data) => data || undefined),
  stockTransactionType: filterEnumSchema(EStockTransactionType),

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

export type TFilterTrackingDetailsSchema = z.infer<
  typeof filterTrackingDetailsSchema
>

export const searchTrackingDetailsSchema = z
  .object({
    search: z.string().catch(""),
    searchType: filterEnumSchema(ESearchType),
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("5"),
    sort: z
      .enum([
        "ItemName",
        "-ItemName",
        "ItemTotal",
        "-ItemTotal",
        "ISBN",
        "-ISBN",
        "UnitPrice",
        "-UnitPrice",
        "TotalAmount",
        "-TotalAmount",
        "BarcodeRangeFrom",
        "-BarcodeRangeFrom",
        "CreatedAt",
        "-CreatedAt",
        "CreatedBy",
        "-CreatedBy",
        "UpdatedAt",
        "-UpdatedAt",
        "UpdatedBy",
        "-UpdatedBy",
      ])
      .optional()
      .catch(undefined),
    hasGlueBarcode: filterBooleanSchema(),
  })
  .and(filterTrackingDetailsSchema)

export type TSearchTrackingDetailsSchema = z.infer<
  typeof searchTrackingDetailsSchema
>
