import { z } from "zod"

import { EDuplicateHandle } from "@/lib/types/enums"

export const importLibraryItemsSchema = z.object({
  scanTitle: z.boolean(),
  scanCoverImage: z.boolean(),
  duplicateHandle: z.nativeEnum(EDuplicateHandle).optional(),
  file: z
    .instanceof(File)
    .optional()
    .refine((data) => data, { message: "required" }),
  coverImageFiles: z.array(z.instanceof(File)),
  previewImages: z.array(z.string()),
})

export type TImportLibraryItemsSchema = z.infer<typeof importLibraryItemsSchema>
