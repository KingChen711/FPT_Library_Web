import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("email")
    .min(2, { message: "min2" })
    .max(50, { message: "max50" }),
})

export type TLoginSchema = z.infer<typeof loginSchema>
