import { z } from "zod"

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
  dob: z.string().trim().min(1, { message: "Date of birth is required" }),
  phone: z.string().trim().length(10, { message: "length_10" }),
  address: z.string().trim().min(1, { message: "Address is required" }),
  gender: z.number().min(0, { message: "Invalid gender value" }), // Giá trị tối thiểu 0
  avatar: z.string().trim().nullable().catch(""),
})

export type TProfileSchema = z.infer<typeof profileSchema>
