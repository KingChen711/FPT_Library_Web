import { z } from "zod"

export const mutateUserSchema = z.object({
  userCode: z.string().trim().nullable().optional(),
  email: z
    .string()
    .trim()
    .email("email")
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
    .enum(["Male", "Female", "Other"])
    .refine((value) => value !== undefined, { message: "required" }),

  dob: z.string().trim().min(1, { message: "required" }),
  phone: z.string().trim().length(10, { message: "length_10" }),
  address: z.string().trim().min(1, { message: "required" }),
})

export type TMutateUserSchema = z.infer<typeof mutateUserSchema>
