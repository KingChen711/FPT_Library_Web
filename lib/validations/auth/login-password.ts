import { z } from "zod"

export const loginPasswordSchema = z.object({
  password: z.string().min(6, { message: "min6" }),
})

export type TLoginPasswordSchema = z.infer<typeof loginPasswordSchema>
