import { z } from "zod"

import { EReservationQueueStatus } from "@/lib/types/enums"
import {
  filterBooleanSchema,
  filterDateRangeSchema,
  filterEnumSchema,
} from "@/lib/zod"

export const filterBorrowReservationSchema = z.object({
  queueStatus: filterEnumSchema(EReservationQueueStatus),
  isReservedAfterRequestFailed: filterBooleanSchema(),
  isAppliedLabel: filterBooleanSchema(),
  isNotified: filterBooleanSchema(),

  reservationDateRange: filterDateRangeSchema,
  expiryDateRange: filterDateRangeSchema,
  assignDateRange: filterDateRangeSchema,
  collectedDateRange: filterDateRangeSchema,
  expectedAvailableDateMinRange: filterDateRangeSchema,
  expectedAvailableDateMaxRange: filterDateRangeSchema,
})

export type TFilterBorrowReservationSchema = z.infer<
  typeof filterBorrowReservationSchema
>

export const searchBorrowReservationsSchema = z
  .object({
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("5"),
    search: z.string().catch(""),
    sort: z
      .enum([
        "ReservationCode",
        "-ReservationCode",
        "ReservationDate",
        "-ReservationDate",
        "ExpectedAvailableDateMin",
        "-ExpectedAvailableDateMin",
        "AssignedDate",
        "-AssignedDate",
        "CollectedDate",
        "-CollectedDate",
        "ExpiryDate",
        "-ExpiryDate",
        "TotalExtendPickup",
        "-TotalExtendPickup",
      ])
      .optional()
      .catch(undefined),
  })
  .and(filterBorrowReservationSchema)

export type TSearchBorrowReservationsSchema = z.infer<
  typeof searchBorrowReservationsSchema
>
