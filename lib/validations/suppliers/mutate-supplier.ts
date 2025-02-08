import { z } from "zod"

import { ESupplierType } from "@/lib/types/enums"

export const mutateSupplierSchema = z.object({
  supplierName: z.string().trim().min(5, "min5").max(255, "max255"),
  contactPerson: z
    .string()
    .trim()
    .optional()
    .transform((data) => (data === "" ? undefined : data))
    .refine((data) => data === undefined || data.length >= 5, {
      message: "min5",
    })
    .refine((data) => data === undefined || data.length <= 255, {
      message: "max255",
    }),
  contactEmail: z
    .string()
    .trim()
    .email()
    .optional()
    .transform((data) => (data === "" ? undefined : data))
    .refine((data) => data === undefined || data.length <= 255, {
      message: "max255",
    }),
  contactPhone: z
    .string()
    .trim()
    .optional()
    .transform((data) => (data === "" ? undefined : data))
    .refine((data) => data === undefined || data.length >= 10, {
      message: "min10",
    })
    .refine((data) => data === undefined || data.length <= 12, {
      message: "max12",
    }),
  address: z
    .string()
    .trim()
    .optional()
    .transform((data) => (data === "" ? undefined : data))
    .refine((data) => data === undefined || data.length <= 300, {
      message: "max300",
    }),
  country: z
    .string()
    .trim()
    .optional()
    .transform((data) => (data === "" ? undefined : data))
    .refine((data) => data === undefined || data.length <= 100, {
      message: "max100",
    }),
  city: z
    .string()
    .trim()
    .optional()
    .transform((data) => (data === "" ? undefined : data))
    .refine((data) => data === undefined || data.length <= 100, {
      message: "max100",
    }),
  supplierType: z.nativeEnum(ESupplierType),
})

export type TMutateSupplierSchema = z.infer<typeof mutateSupplierSchema>
