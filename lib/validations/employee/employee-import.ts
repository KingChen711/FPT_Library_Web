import { z } from "zod"

export const employeeImportSchema = z.object({
  file: z.instanceof(File).optional(),
  duplicateHandle: z.enum(["0", "1", "2"]),
  columnSeparator: z.enum([",", ".", "@", "!"]),
  encodingType: z.enum(["UTF8", "ASCII"]),
  scanningFields: z.enum(["Email", "Phone"]),
})

export type TEmployeeImport = z.infer<typeof employeeImportSchema>

/**
 * Note:
 * duplicateHandle: {
 *   0: Allow
 *   1: Replace
 *   2: Skip
 * },
 */
