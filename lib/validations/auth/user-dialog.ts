import { z } from "zod"

export const userDialogSchema = z.object({
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
  dob: z.string().min(2, { message: "min2" }).max(50, { message: "max50" }),
  phone: z.string().min(2, { message: "min2" }).max(50, { message: "max50" }),
  avatar: z.string().min(2, { message: "min2" }).max(50, { message: "max50" }),
  isActive: z.boolean(),
})

export type TUserDialogSchema = z.infer<typeof userDialogSchema>
