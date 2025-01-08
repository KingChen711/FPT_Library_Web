import { z } from "zod"

import { bookCopySchema } from "../mutate-book"

export const bookEditionAddCopiesSchema = z.object({
  bookEditionCopies: z.array(bookCopySchema).min(1, "copiesMin1"),
})

export type TBookEditionAddCopiesSchema = z.infer<
  typeof bookEditionAddCopiesSchema
>
