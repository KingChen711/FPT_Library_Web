// import { format } from "date-fns"
import { z } from "zod"

import { EGender } from "@/lib/types/enums"

export const editPatronSchema = z.object({
  firstName: z.coerce.string().min(1, "min1"),
  lastName: z.coerce.string().min(1, "min1"),
  gender: z.nativeEnum(EGender).optional(),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((data) => (data === "" ? undefined : data)),
  address: z
    .string()
    .trim()
    .optional()
    .transform((data) => (data === "" ? undefined : data)),
  dob: z.date({ message: "min1" }).optional(),
  // .transform((data) =>
  //   data === undefined ? undefined : format(data, "yyyy-MM-dd")
  // ),
})

export type TEditPatronSchema = z.infer<typeof editPatronSchema>
