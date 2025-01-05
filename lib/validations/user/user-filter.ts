import { z } from "zod"

export const usersFilterSchema = z.object({
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  gender: z.enum(["Male", "Female", "Other"]),
  dobRange: z.array(z.date().or(z.string().trim().length(0))), // date or ""
  createDateRange: z.array(z.date().or(z.string().trim().length(0))), // date or ""
  modifiedDateRange: z.array(z.date().or(z.string().trim().length(0))), // date or ""
})

export type TUsersFilterSchema = z.infer<typeof usersFilterSchema>
