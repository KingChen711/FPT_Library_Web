import { z } from "zod"

import { ETransactionMethod } from "@/lib/types/enums"

export const extendCardSchema = z
  .object({
    transactionMethod: z.nativeEnum(ETransactionMethod), // 0 - Cash, 1 - DigitalPayment

    //client only
    confirmPatronHasCash: z.boolean(),

    //hidden on transaction method is cash
    paymentMethodId: z.coerce.number().optional(),
    libraryCardPackageId: z.coerce.number({ message: "min1" }),

    //client only
    package: z.any(),
  })
  .transform((data) => {
    data.paymentMethodId =
      data.transactionMethod === ETransactionMethod.CASH ? undefined : 1 //!hard code PAY OS
    return data
  })
  .refine(
    (data) =>
      data.transactionMethod === ETransactionMethod.CASH ||
      !!data.paymentMethodId,
    {
      message: "paymentMethodId",
      path: ["paymentMethodId"],
    }
  )
  .refine(
    (data) =>
      data.transactionMethod === ETransactionMethod.DIGITAL_PAYMENT ||
      data.confirmPatronHasCash,
    {
      message: "min1",
      path: ["confirmPatronHasCash"],
    }
  )

export type TExtendCardSchema = z.infer<typeof extendCardSchema>
