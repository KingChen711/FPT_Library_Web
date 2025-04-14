import { z } from "zod"

import {
  ETransactionMethod,
  ETransactionStatus,
  ETransactionType,
} from "@/lib/types/enums"
import {
  filterDateRangeSchema,
  filterEnumSchema,
  filterNumRangeSchema,
} from "@/lib/zod"

export const filterTransactionSchema = z.object({
  transactionStatus: filterEnumSchema(ETransactionStatus),
  transactionType: filterEnumSchema(ETransactionType),
  transactionMethod: filterEnumSchema(ETransactionMethod),

  amountRange: filterNumRangeSchema,

  transactionDateRange: filterDateRangeSchema,
  expiredAtRange: filterDateRangeSchema,
  cancelledAtRange: filterDateRangeSchema,
})

export type TFilterTransactionSchema = z.infer<typeof filterTransactionSchema>

export const searchTransactionsSchema = z
  .object({
    search: z.string().catch(""),
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("5"),
    sort: z
      .enum([
        "TransactionCode",
        "-TransactionCode",
        "Amount",
        "-Amount",
        "TransactionDate",
        "-TransactionDate",
        "ExpiryAt",
        "-ExpiryAt",
        "CancelledAt",
        "-CancelledAt",
      ])
      .optional()
      .catch(undefined),
  })
  .and(filterTransactionSchema)

export type TSearchTransactionsSchema = z.infer<typeof searchTransactionsSchema>
