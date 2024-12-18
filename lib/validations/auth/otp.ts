import { z } from "zod"

export const otpSchema = z.object({
  pin: z.string().trim().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

export type TOtpSchema = z.infer<typeof otpSchema>
