import { z } from "zod"

import { EGender } from "@/lib/types/enums"

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
    dob: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      return !!data.detectedFacesResult
    },
    {
      //* require on validate, not on initial
      message: "validAvatarAI",
      path: ["avatar"],
    }
  )

export type TCreatePatronSchema = z.infer<typeof createPatronSchema>
