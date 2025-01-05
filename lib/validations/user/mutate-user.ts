import { z } from "zod"

import { MUTATE_USER_GENDER } from "@/lib/types/models"

export const mutateUserSchema = z.object({
  userCode: z
    .string()
    .trim()
    .min(2, { message: "min2" })
    .max(10, { message: "max10" }),
  email: z
    .string()
    .trim()
    .email({ message: "email" })
    .toLowerCase()
    .min(2, { message: "min2" })
    .max(50, { message: "max50" }),
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
  gender: z
    .nativeEnum(MUTATE_USER_GENDER)
    .refine((value) => value !== undefined, { message: "required" }),

  dob: z.string().trim().min(1, { message: "required" }),
  phone: z.string().trim().length(10, { message: "length_10" }),
  address: z.string().trim().min(1, { message: "required" }),
})

export type TMutateUserSchema = z.infer<typeof mutateUserSchema>
