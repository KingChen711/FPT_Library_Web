import { z } from "zod"

const emptyToUndefined = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? undefined : val

export const editAuthorSchema = z.object({
  // Nếu giá trị là chuỗi rỗng thì chuyển thành undefined
  authorImage: z.preprocess(emptyToUndefined, z.string().optional()),
  fullName: z
    .string()
    .trim()
    .min(2, { message: "min2" })
    .max(50, { message: "max50" }),
  biography: z.preprocess(emptyToUndefined, z.string().optional()),
  dob: z.preprocess(emptyToUndefined, z.string().optional()),
  dateOfDeath: z.preprocess(emptyToUndefined, z.string().optional()),
  nationality: z.preprocess(emptyToUndefined, z.string().optional()),
})

export type TEditAuthorSchema = z.infer<typeof editAuthorSchema>
