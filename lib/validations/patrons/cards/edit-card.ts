// import { format } from "date-fns"
import { z } from "zod"

import { EGender, EIssuanceMethod } from "@/lib/types/enums"

export const editCardSchema = z
  .object({
    fullName: z.coerce.string().min(1, "min1"),
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
    issuanceMethod: z.nativeEnum(EIssuanceMethod),

    isAllowBorrowMore: z.coerce.boolean(),
    maxItemOnceTime: z.coerce
      .number({ message: "min1" })
      .gte(3, "gte3")
      .optional(),
    allowBorrowMoreReason: z
      .string({ message: "min1" })
      .min(1, "min1")
      .optional(),
  })
  .transform((data) => {
    if (!data.isAllowBorrowMore) {
      data.maxItemOnceTime = undefined
      data.allowBorrowMoreReason = undefined
    }
    return data
  })

  .refine((data) => !data.isAllowBorrowMore || data.maxItemOnceTime, {
    message: "min1",
    path: ["maxItemOnceTime"],
  })
  .refine((data) => !data.isAllowBorrowMore || data.allowBorrowMoreReason, {
    message: "min1",
    path: ["allowBorrowMoreReason"],
  })
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

export type TEditCardSchema = z.infer<typeof editCardSchema>
