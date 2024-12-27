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
  dob: z.string().trim().min(1, { message: "required" }),
  phone: z.string().trim().length(10, { message: "length_10" }),
  address: z.string().trim().min(1, { message: "required" }),
  gender: z.enum(["Male", "Female"]).catch("Female"),
  avatar: z.string().trim().min(1, { message: "required" }),
  hireDate: z.string().trim().min(1, { message: "required" }),
  terminationDate: z.string().trim().min(1, { message: "required" }),
  roleId: z.number().min(1, { message: "invalid" }), // Giá trị tối thiểu 1
})

export type TMutateEmployeeSchema = z.infer<typeof mutateEmployeeSchema>
