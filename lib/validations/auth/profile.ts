import { z } from "zod"

export const profileSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(6, { message: "Full name must be at least 6 characters" }),
  collegeEmailId: z.string().trim().email({ message: "Invalid email format" }),
  studentCode: z
    .string()
    .trim()
    .min(4, { message: "Register number must be at least 4 characters" }),
  phoneNumber: z
    .string()
    .trim()
    .min(10, { message: "Phone number must be at least 10 digits" }),
  dob: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date of birth must be in the format YYYY-MM-DD",
    }),
  gender: z.enum(["Male", "Female"], {
    message: "Gender must be either Male or Female",
  }),
  bio: z
    .string()
    .trim()
    .min(10, { message: "Bio must be at least 10 characters" }),
})

export type TProfileSchema = z.infer<typeof profileSchema>
