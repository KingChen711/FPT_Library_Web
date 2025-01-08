import { z } from "zod"

import { EBookFormat } from "@/lib/types/enums"

import { isbnSchema } from "../../isbn"
import { bookCopySchema } from "../mutate-book"

export const createEditionSchema = z
  .object({
    editionTitle: z.string().trim().min(1, "min1").max(150, "max150"),
    editionNumber: z.coerce.number().gt(0, "gt0"),
    editionSummary: z.string().trim().max(500, "max500"),
    language: z.string().trim(),
    bookFormat: z.nativeEnum(EBookFormat),
    pageCount: z.coerce.number().gt(0, "gt0"),
    publicationYear: z.coerce
      .number()
      .gt(0, "gt0")
      .refine((data) => data <= new Date().getFullYear(), "publicationYear"),
    publisher: z.string().trim().min(1, "min1"),
    isbn: isbnSchema,
    coverImage: z.string().trim().min(1, "min1"),
    //client only
    file: z.instanceof(File).optional(),
    //client only
    validImage: z.boolean().optional(),
    estimatedPrice: z.coerce.number().gt(0, "gt0"),
    authorIds: z.array(z.coerce.number()).min(1, "authorsMin1"),
    bookCopies: z.array(bookCopySchema).min(1, "copiesMin1"),
  })
  .refine((data) => data.validImage, {
    message: "validImageAI",
    path: ["coverImage"],
  })

export type TCreateEditionSchema = z.infer<typeof createEditionSchema>
