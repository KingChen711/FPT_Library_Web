import { z } from "zod"

import { EDuplicateHandle } from "@/lib/types/enums"

export const importFinesSchema = z
  .object({
    file: z.instanceof(File).optional(),
    duplicateHandle: z.nativeEnum(EDuplicateHandle),
  })
  .refine(
    (data) => {
      return data.file
    },
    {
      //require on validate, not on initial
      message: "fileRequire",
      path: ["file"],
    }
  )

export type TImportFines = z.infer<typeof importFinesSchema>
