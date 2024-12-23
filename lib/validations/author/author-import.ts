import { z } from "zod"

export const authorImportSchema = z.object({
  file: z.instanceof(File).optional(),
  duplicateHandle: z.enum(["0", "1", "2"]),
  columnSeparator: z.union([z.enum([",", ".", "@", "!"]), z.null()]),
  encodingType: z.union([z.enum(["UTF-8", "ASCII"]), z.null()]),
  scanningFields: z.array(z.enum(["email", "phone"])),
})

export type TAuthorImport = z.infer<typeof authorImportSchema>

/**
 * Note:
 * duplicateHandle: {
 *   0: Allow
 *   1: Replace
 *   2: Skip
 * },
 */
