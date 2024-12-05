import { z } from "zod"

export const profileSchema = z.object({
  fullname: z
    .string()
    .min(6, { message: "Full name must be at least 6 characters" }),
  collegeEmailId: z.string().email(),
  registerNumber: z
    .string()
    .min(4, { message: "Register number must be 4 digits" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be 10 digits" }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
})

export type TProfileSchema = z.infer<typeof profileSchema>
