import { z } from "zod"

export const mutateTrackingDetailSchema = z.object({
  itemName: z.string().min(1, "min1"),
  itemTotal: z.coerce.number({ message: "required" }),
  isbn: z
    .string()
    .trim()
    .optional()
    .transform((data) => (data === "" ? undefined : data)),
  unitPrice: z.coerce.number({ message: "required" }),
  totalAmount: z.coerce.number({ message: "required" }),
  reason: z
    .string()
    .trim()
    .optional()
    .transform((data) => (data === "" ? undefined : data)),
  categoryId: z.coerce.number(),
})

export type TMutateTrackingDetailSchema = z.infer<
  typeof mutateTrackingDetailSchema
>
