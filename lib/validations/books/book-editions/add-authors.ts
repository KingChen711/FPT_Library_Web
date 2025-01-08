import { z } from "zod"

export const bookEditionAddAuthorsSchema = z.object({
  authorIds: z.array(z.coerce.number()).min(1, "authorsMin1"),
})

export type TBookEditionAddAuthorsSchema = z.infer<
  typeof bookEditionAddAuthorsSchema
>
