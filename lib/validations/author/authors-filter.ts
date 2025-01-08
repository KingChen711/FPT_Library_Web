import { z } from "zod"

export const authorsFilterSchema = z.object({
  authorCode: z.string().trim(),
  nationality: z.string().trim(),
  dobRange: z.array(z.date().or(z.string().trim().length(0))), // date or ""
  dateOfDeathRange: z.array(z.date().or(z.string().trim().length(0))), // date or ""
  createDateRange: z.array(z.date().or(z.string().trim().length(0))), // date or ""
  modifiedDateRange: z.array(z.date().or(z.string().trim().length(0))), // date or ""
})

export type TAuthorsFilterSchema = z.infer<typeof authorsFilterSchema>
