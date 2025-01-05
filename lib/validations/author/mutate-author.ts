import { z } from "zod"

export const mutateAuthorSchema = z.object({
  authorCode: z.string().trim().min(2, { message: "min2" }),
  fullName: z
    .string()
    .trim()
    .min(2, { message: "min2" })
    .max(50, { message: "max50" }),
  authorImage: z.string().trim().min(1, { message: "required" }),
  dob: z.string().trim().min(1, { message: "required" }),
  dateOfDeath: z.string().trim().nullable().optional(),
  nationality: z.string().trim().min(1, { message: "required" }),
  biography: z.string().trim().min(10, { message: "min10" }),
})

export type TMutateAuthorSchema = z.infer<typeof mutateAuthorSchema>
