import { z } from "zod"

export const authorDialogSchema = z.object({
  authorCode: z.string().trim().min(2, { message: "min2" }),
  authorImage: z.string().trim().min(1, { message: "required" }),
  fullName: z
    .string()
    .trim()
    .min(2, { message: "min2" })
    .max(50, { message: "max50" }),
  biography: z
    .string()
    .trim()
    .min(2, { message: "min2" })
    .max(50, { message: "max50" }),
  dob: z.string().trim().min(1, { message: "required" }),
  dateOfDeath: z.string().trim().optional(),
  nationality: z.string().trim().min(1, { message: "required" }),
})

export type TAuthorDialogSchema = z.infer<typeof authorDialogSchema>
