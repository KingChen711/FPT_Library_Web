import { z } from "zod"

import { EDuplicateHandle } from "@/lib/types/enums"

export const importTrackingDetailsSchema = z
  .object({
    file: z.instanceof(File).optional(),
    duplicateHandle: z.nativeEnum(EDuplicateHandle).optional(),
    scanItemName: z.coerce.boolean(),
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

export type TImportTrackingDetailsSchema = z.infer<
  typeof importTrackingDetailsSchema
>
