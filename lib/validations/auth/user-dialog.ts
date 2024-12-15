import { z } from "zod"

export const userDialogSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "email" })
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
  dob: z.string().trim().min(1, { message: "required" }),
  phone: z.string().trim().length(10, { message: "length_10" }),
  avatar: z
    .string()
    .trim()
    .min(2, { message: "min2" })
    .max(50, { message: "max50" })
    .optional(),
  isActive: z.boolean(),
  gender: z.enum(["Male", "Female"], {
    message: "Gender must be 'Male' or 'Female'",
  }),
  role: z.string().trim().min(1, { message: "required" }),
})

export type TUserDialogSchema = z.infer<typeof userDialogSchema>
