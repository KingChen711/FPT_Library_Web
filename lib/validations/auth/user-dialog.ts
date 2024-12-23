import { z } from "zod"

export const userDialogSchema = z.object({
  userCode: z.string().trim().min(2, { message: "min2" }),
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
  dob: z.string().trim().min(1, { message: "Date of birth is required" }),
  phone: z.string().trim().length(10, { message: "length_10" }),
  address: z.string().trim().min(1, { message: "Address is required" }),
  gender: z.number().min(0, { message: "Invalid gender value" }),
})

export type TUserDialogSchema = z.infer<typeof userDialogSchema>
