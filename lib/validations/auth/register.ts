import { z } from "zod"

export const registerSchema = z.object({
  studentCode: z.string().min(8).max(8),
  email: z.string().min(2).max(50),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
})

export type TRegisterSchema = z.infer<typeof registerSchema>
