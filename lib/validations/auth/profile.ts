import { z } from "zod"

export const profileSchema = z.object({
  userCode: z.string().nullable().catch(null),
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  email: z.string().email("Invalid email format").nullable().catch(null),
  phone: z.string().nullable().catch(null),
  avatar: z.string().url("Invalid URL format").nullable().catch(null),
  address: z.string().nullable().catch(null),
  gender: z.string().nullable().catch(null),
  dob: z.string().nullable().catch(null), // ISO date format validation can be added if needed
})

export type TProfileSchema = z.infer<typeof profileSchema>
