import { DateTime } from "luxon"
import { z } from "zod"

import { EGender, ETransactionMethod } from "@/lib/types/enums"

export const createPatronSchema = z
  .object({
    email: z.coerce.string().email("email").min(1, "min1"),
    firstName: z.coerce.string().min(1, "min1"),
    lastName: z.coerce.string().min(1, "min1"),
    gender: z.nativeEnum(EGender),

    avatar: z.coerce.string().min(1, "min1"),

    //client only
    file: z.instanceof(File).optional(),

    //client only
    detectedFacesResult: z
      .object({
        faces: z.array(
          z.object({
            attributes: z.object({
              gender: z
                .object({
                  value: z.nativeEnum(EGender),
                })
                .or(z.null()),
              age: z
                .object({
                  value: z.coerce.number(),
                })
                .or(z.null()),
            }),
          })
        ),
      })
      .optional(),

    phone: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data)),
    address: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data)),
    dob: z
      .date({ message: "min1" })
      .optional()
      .transform((data) =>
        data
          ? DateTime.fromJSDate(data)
              .setZone("UTC", { keepLocalTime: true })
              .toJSDate()
          : undefined
      ),
    // .transform((data) =>
    //   data === undefined ? undefined : format(data, "yyyy-MM-dd")
    // ),

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
  .refine(
    (data) => {
      return (
        !!data.detectedFacesResult &&
        data.detectedFacesResult.faces.length === 1
      )
    },
    {
      //* require on validate, not on initial
      message: "validAvatarAI",
      path: ["avatar"],
    }
  )

export type TCreatePatronSchema = z.infer<typeof createPatronSchema>
