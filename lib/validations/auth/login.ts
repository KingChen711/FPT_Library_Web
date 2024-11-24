import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .email("email")
    .min(2, { message: "min2" })
    .max(50, { message: "max50" }),
  password: z.string().min(6, { message: "min6" }),
})

export type TLoginSchema = z.infer<typeof loginSchema>
