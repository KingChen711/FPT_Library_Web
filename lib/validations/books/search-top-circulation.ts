import { z } from "zod"

import { ESearchType } from "@/lib/types/enums"
import { filterEnumSchema } from "@/lib/zod"

export const filterTopCirculation = z.object({
  title: z
    .string()
    .optional()
    .catch(undefined)
    .transform((data) => data || undefined),
  author: z.coerce
    .string()
    .optional()
    .catch(undefined)
    .transform((data) => data || undefined),
  isbn: z.coerce
    .string()
    .optional()
    .catch(undefined)
    .transform((data) => data || undefined),
  classificationNumber: z.coerce
    .string()
    .optional()
    .catch(undefined)
    .transform((data) => data || undefined),
  genres: z
    .string()
    .optional()
    .catch(undefined)
    .transform((data) => data || undefined),
  publisher: z
    .string()
    .optional()
    .catch(undefined)
    .transform((data) => data || undefined),
  topicalTerms: z
    .string()
    .optional()
    .catch(undefined)
    .transform((data) => data || undefined),

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

export type TFilterTopCirculation = z.infer<typeof filterTopCirculation>

export const searchTopCirculation = z
  .object({
    searchType: filterEnumSchema(ESearchType),
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("5"),
    search: z.string().catch(""),
    sort: z
      .enum([
        "BorrowSuccessCount",
        "-BorrowSuccessCount",
        "BorrowFailedCount",
        "-BorrowFailedCount",
        "ReserveCount",
        "-ReserveCount",
        "ExtendedBorrowCount",
        "-ExtendedBorrowCount",
        "DigitalBorrowCount",
        "-DigitalBorrowCount",
        "BorrowFailedRate",
        "-BorrowFailedRate",
        "BorrowExtensionRate",
        "-BorrowExtensionRate",
      ])
      .optional()
      .catch(undefined),
  })
  .and(filterTopCirculation)

export type TSearchTopCirculation = z.infer<typeof searchTopCirculation>
