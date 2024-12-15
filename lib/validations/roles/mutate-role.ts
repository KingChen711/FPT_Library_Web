import { z } from "zod"

import { ERoleType } from "@/lib/types/enums"

export const mutateRoleSchema = z.object({
  englishName: z.string().trim(),
  vietnameseName: z.string().trim(),
  roleTypeIdx: z.nativeEnum(ERoleType),
})

export type TMutateRoleSchema = z.infer<typeof mutateRoleSchema>
