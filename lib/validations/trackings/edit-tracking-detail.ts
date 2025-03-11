import { z } from "zod"

import { EStockTransactionType } from "@/lib/types/enums"

export const editTrackingDetailSchema = z.object({
  itemName: z.string().min(1, "min1"),
  itemTotal: z.coerce.number({ message: "required" }),
  isbn: z
    .string()
    .trim()
    .optional()
    .transform((data) => (data === "" ? undefined : data)),
  unitPrice: z.coerce.number({ message: "required" }),
  totalAmount: z.coerce.number({ message: "required" }),
  categoryId: z.coerce.number(),
  conditionId: z.coerce.number(),
  stockTransactionType: z.nativeEnum(EStockTransactionType),
})

export type TEditTrackingDetailSchema = z.infer<typeof editTrackingDetailSchema>
