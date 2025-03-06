import { DateTime } from "luxon"
import { z } from "zod"

import { EDuplicateHandle, ETrackingType } from "@/lib/types/enums"

export const createTrackingSchema = z
  .object({
    coverImageFiles: z.array(z.instanceof(File)),
    previewImages: z.array(z.string()),
    file: z.instanceof(File).optional(),
    duplicateHandle: z.nativeEnum(EDuplicateHandle).optional(),
    supplierId: z.coerce.number({ message: "required" }),
    totalItem: z.coerce.number({ message: "required" }).gt(0, "gt0"),
    totalAmount: z.coerce
      .number({ message: "required" })
      .gte(1000, "gte1000")
      .lte(9999999999, "lte9999999999"),
    trackingType: z.nativeEnum(ETrackingType),

    entryDate: z
      .date({ message: "min1" })
      .transform((data) =>
        DateTime.fromJSDate(data)
          .setZone("UTC", { keepLocalTime: true })
          .toJSDate()
      ),

    expectedReturnDate: z
      .date({ message: "min1" })
      .optional()
      .transform((data) =>
        data
          ? DateTime.fromJSDate(data)
              .setZone("UTC", { keepLocalTime: true })
              .toJSDate()
          : undefined
      ),

    transferLocation: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data))
      .refine((data) => data === undefined || data.length <= 255, {
        message: "max255",
      }),
    description: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data))
      .refine((data) => data === undefined || data.length <= 255, {
        message: "max255",
      }),

    scanItemName: z.coerce.boolean(),
    scanTitle: z.coerce.boolean(),
    scanCoverImage: z.coerce.boolean(),
  })
  .refine(
    (data) => {
      return data.file
    },
    {
      //require on validate, not on initial
      message: "fileRequire",
      path: ["file"],
    }
  )
  .refine(
    (data) => {
      return (
        data.trackingType !== ETrackingType.TRANSFER || data.transferLocation
      )
    },
    {
      //require on validate, not on initial
      message: "transferLocation",
      path: ["min1"],
    }
  )
  .refine(
    (data) => {
      return (
        data.trackingType !== ETrackingType.TRANSFER || data.expectedReturnDate
      )
    },
    {
      //require on validate, not on initial
      message: "expectedReturnDate",
      path: ["min1"],
    }
  )
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

export type TCreateTrackingSchema = z.infer<typeof createTrackingSchema>
