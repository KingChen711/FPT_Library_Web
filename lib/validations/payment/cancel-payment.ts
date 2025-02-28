import { z } from "zod"

export const cancelPaymentSchema = z.object({
  orderCode: z.string({ message: "min1" }).min(1, "min1"),
  cancellationReason: z.string({ message: "min1" }).min(1, "min1"),
  paymentLinkId: z.string(),
})

export type TCancelPaymentSchema = z.infer<typeof cancelPaymentSchema>
