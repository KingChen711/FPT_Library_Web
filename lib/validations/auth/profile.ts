import { z } from "zod"

import { EIdxGender } from "@/lib/types/enums"

export enum EGenderProfile {
  Male = "Male",
  Female = "Female",
}

export const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { message: "min2" })
    .max(50, { message: "max50" }),
  lastName: z
    .string()
    .trim()
    .min(2, { message: "min2" })
    .max(50, { message: "max50" }),
  dob: z.string().trim().optional(),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((data) => (data === "" ? undefined : data))
    .refine((data) => data === undefined || data.length === 10, {
      message: "length_10",
    }),
  address: z.string().trim().optional(),
  gender: z.nativeEnum(EIdxGender).optional(),
  avatar: z.string().trim().optional(),
})

export type TProfileSchema = z.infer<typeof profileSchema>
