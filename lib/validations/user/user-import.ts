import { z } from "zod"

export const employeeImportSchema = z.object({
  file: z.instanceof(File).optional(),
  duplicateHandle: z.enum(["0", "1", "2"]),
  columnSeparator: z.union([z.enum([",", ".", "@", "!"]), z.null()]),
  encodingType: z.union([z.enum(["UTF-8", "ASCII"]), z.null()]),
  scanningFields: z.array(z.enum(["email", "phone"])),
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
