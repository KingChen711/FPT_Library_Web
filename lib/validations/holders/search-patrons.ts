import { z } from "zod"

import { EGender } from "@/lib/types/enums"

export const filterPatronSchema = z.object({
  gender: z.nativeEnum(EGender).optional().catch(undefined),
  createDateRage: z.array(z.date().or(z.null())).catch([null, null]),
})

export type TFilterHolderSchema = z.infer<typeof filterPatronSchema>

export const searchPatronsSchema = z
  .object({
    search: z.string().catch(""),
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("10"),
    sort: z
      .enum([
        "Email",
        "-Email",
        "CreateDate",
        "-CreateDate",
        "Phone",
        "-Phone",
        "Dob",
        "-Dob",
        "ModifiedDate",
        "-ModifiedDate",
        "ModifiedBy",
        "-ModifiedBy",
      ])
      .optional()
      .catch(undefined),
  })
  .and(filterPatronSchema)

export type TSearchPatronsSchema = z.infer<typeof searchPatronsSchema>
