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

  transactionDateRange: filterDateRangeSchema,
  expirationDateRange: filterDateRangeSchema,
  cancelledAtRange: filterDateRangeSchema,
  amountRange: filterNumRangeSchema,
})

export type TFilterTransactionSchema = z.infer<typeof filterTransactionSchema>

export const searchTransactionSchema = z
  .object({
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("5"),
    searchTransaction: z.string().catch(""),
    sort: z
      .enum([
        "TransactionCode",
        "-TransactionCode",
        "Amount",
        "-Amount",
        "TransactionDate",
        "-TransactionDate",
        "ExpiredAt",
        "-ExpiredAt",
        "CreatedAt",
        "-CreatedAt",
        "CancelledAt",
        "-CancelledAt",
      ])
      .optional()
      .catch(undefined),
  })
  .and(filterTransactionSchema)

export type TSearchTransactionsSchema = z.infer<typeof searchTransactionSchema>
