import { z } from "zod"

import { EDuplicateHandle } from "@/lib/types/enums"

export const importSuppliersSchema = z
  .object({
    file: z.instanceof(File).optional(),
    duplicateHandle: z.nativeEnum(EDuplicateHandle).optional(),
    scanSupplierName: z.coerce.boolean(),
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

export type TImportSuppliersSchema = z.infer<typeof importSuppliersSchema>
