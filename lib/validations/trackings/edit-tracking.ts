import { DateTime } from "luxon"
import { z } from "zod"

import { ETrackingType } from "@/lib/types/enums"

export const editTrackingSchema = z
  .object({
    supplierId: z.coerce.number({ message: "required" }),
    totalItem: z.coerce.number({ message: "required" }).gt(0, "gt0"), //
    totalAmount: z.coerce
      .number({ message: "required" })
      .gte(1000, "gte1000")
      .lte(9999999999, "lte9999999999"), //
    trackingType: z.nativeEnum(ETrackingType), //
    entryDate: z.coerce
      .date({ message: "min1" })
      .transform((data) =>
        DateTime.fromJSDate(data)
          .setZone("UTC", { keepLocalTime: true })
          .toJSDate()
      ),
    transferLocation: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data))
      .refine((data) => data === undefined || data.length <= 255, {
        message: "max255",
      }), //
    description: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data))
      .refine((data) => data === undefined || data.length <= 255, {
        message: "max255",
      }), //
    reason: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data)),
    expectedReturnDate: z.coerce
      .date()
      .optional()
      .transform((data) =>
        data
          ? DateTime.fromJSDate(data)
              .setZone("UTC", { keepLocalTime: true })
              .toJSDate()
          : undefined
      ),
  })
  .refine(
    (data) => {
      return (
        !data.expectedReturnDate ||
        new Date(data.expectedReturnDate) > new Date(data.entryDate)
      )
    },
    {
      //require on validate, not on initial
      message: "expectedReturnDate",
      path: ["expectedReturnDate"],
    }
  )

export type TEditTrackingSchema = z.infer<typeof editTrackingSchema>
