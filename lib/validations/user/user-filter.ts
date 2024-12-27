import { z } from "zod"

export const usersFilterSchema = z.object({
  userCode: z.string().trim(),
  roleId: z.string().trim(),
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  gender: z.enum(["All", "Male", "Female", "Other"]),
  isActive: z.string().trim(),
  dobRange: z.array(z.date().or(z.string().trim().length(0))), // date or ""
  createDateRange: z.array(z.date().or(z.string().trim().length(0))), // date or ""
  modifiedDateRange: z.array(z.date().or(z.string().trim().length(0))), // date or ""
  hireDateRange: z.array(z.date().or(z.string().trim().length(0))), // date or ""
})

export type TUsersFilterSchema = z.infer<typeof usersFilterSchema>
