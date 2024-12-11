import { z } from "zod"

export const employeeDialogSchema = z.object({
  email: z
    .string()
    .email({ message: "email" })
    .min(2, { message: "min2" })
    .max(50, { message: "max50" }),
  firstName: z
    .string()
    .min(2, { message: "min2" })
    .max(50, { message: "max50" }),
  lastName: z
    .string()
    .min(2, { message: "min2" })
    .max(50, { message: "max50" }),
  dob: z.string().min(1, { message: "required" }),
  phone: z.string().length(10, { message: "length_10" }),
  avatar: z
    .string()
    .min(2, { message: "min2" })
    .max(50, { message: "max50" })
    .optional(),
  isActive: z.boolean(),
  gender: z.enum(["Male", "Female"], {
    message: "Gender must be 'Male' or 'Female'",
  }),
  role: z.string().min(1, { message: "required" }),
})

export type TEmployeeDialogSchema = z.infer<typeof employeeDialogSchema>
