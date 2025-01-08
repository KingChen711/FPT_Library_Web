import { z } from "zod"

export const userImportSchema = z.object({
  file: z.instanceof(File).optional(),
  duplicateHandle: z.enum(["0", "1", "2"]),
  isSendEmail: z.boolean().catch(false),
})

export type TUserImport = z.infer<typeof userImportSchema>

/**
 * Note:
 * duplicateHandle: {
 *   0: Allow
 *   1: Replace
 *   2: Skip
 * },
 */
