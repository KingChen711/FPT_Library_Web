import { z } from "zod"

export const mutateLibraryPackageSchema = z.object({
  packageName: z.string().trim().min(1, "min1"),
  price: z.coerce.number().int("integer").gt(0, "gt0"),
  durationInMonths: z.coerce.number().int("integer").gt(0, "gt0"),
  description: z.string().trim().min(1, "min1"),
})

export type TMutateLibraryPackageSchema = z.infer<
  typeof mutateLibraryPackageSchema
>
