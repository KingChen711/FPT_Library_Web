import { z } from "zod"

export const profileSchema = z.object({
  userCode: z.string().trim().nullable().catch(null),
  firstName: z.string().trim().nonempty("First name is required"),
  lastName: z.string().trim().nonempty("Last name is required"),
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .toLowerCase()
    .nullable()
    .catch(null),
  phone: z.string().trim().nullable().catch(null),
  avatar: z.string().trim().url("Invalid URL format").nullable().catch(null),
  address: z.string().trim().nullable().catch(null),
  gender: z.string().trim().nullable().catch(null),
  dob: z.string().trim().nullable().catch(null), // ISO date format validation can be added if needed
})

export type TProfileSchema = z.infer<typeof profileSchema>
