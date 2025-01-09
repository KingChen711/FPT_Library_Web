import { z } from "zod"

export const otpSchema = z.object({
  pin: z.string().trim().length(6, {
    message: "length6",
  }),
})

export type TOtpSchema = z.infer<typeof otpSchema>
