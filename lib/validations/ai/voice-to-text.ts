import { z } from "zod"

export const voiceToTextSchema = z.object({
  languageCode: z.string().trim().min(1, "required"),
  audioFile: z.instanceof(File, { message: "required" }),
})

export type TVoiceToTextSchema = z.infer<typeof voiceToTextSchema>
