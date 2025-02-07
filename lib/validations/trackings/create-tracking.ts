import { z } from "zod"

import { EDuplicateHandle, ETrackingType } from "@/lib/types/enums"

export const createTrackingSchema = z
  .object({
    supplierId: z.coerce.number({ message: "required" }),
    totalItem: z.coerce.number({ message: "required" }).gt(0, "gt0"), //
    totalAmount: z.coerce
      .number({ message: "required" })
      .gte(1000, "gte1000")
      .lte(9999999999, "lte9999999999"), //
    trackingType: z.nativeEnum(ETrackingType), //
    entryDate: z.string().min(1, "min1"), //
    file: z.instanceof(File).optional(), //
    duplicateHandle: z.nativeEnum(EDuplicateHandle).optional(), //
    scanItemName: z.coerce.boolean(), //
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
    expectedReturnDate: z.string().optional(),
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
