import { z } from "zod"

import { EDuplicateHandle } from "@/lib/types/enums"

export const importPatronsSchema = z.object({
  duplicateHandle: z.nativeEnum(EDuplicateHandle).optional(),
  file: z
    .instanceof(File)
    .optional()
    .refine((data) => data, { message: "required" }),
  avatarImageFiles: z.array(z.instanceof(File)),
  previewImages: z.array(z.string()),
})

export type TImportPatronsSchema = z.infer<typeof importPatronsSchema>
