import { z } from "zod"

export const mutateEmployeeSchema = z.object({
  employeeCode: z.string().trim().min(2, { message: "min2" }),
  email: z
    .string()
    .trim()
    .email({ message: "email" })
    .toLowerCase()
    .min(2, { message: "min2" })
    .max(50, { message: "max50" }),
  firstName: z
    .string()
    .trim()
    .min(2, { message: "min2" })
    .max(50, { message: "max50" }),
  lastName: z
    .string()
    .trim()
    .min(2, { message: "min2" })
    .max(50, { message: "max50" }),
  dob: z.string().trim().min(1, { message: "Date of birth is required" }),
  phone: z.string().trim().length(10, { message: "length_10" }),
  address: z.string().trim().min(1, { message: "Address is required" }),
  gender: z.enum(["Male", "Female"]).catch("Female"),
  avatar: z.string().trim().min(1, { message: "Avatar is required" }),
  hireDate: z.string().trim().min(1, { message: "Required" }),
  terminationDate: z.string().trim().min(1, { message: "Required" }),
  roleId: z.number().min(1, { message: "Invalid role ID" }), // Giá trị tối thiểu 1
})

export type TMutateEmployeeSchema = z.infer<typeof mutateEmployeeSchema>
