import { z } from "zod"

import { EBookFormat } from "@/lib/types/enums"

import { isbnSchema } from "../../isbn"

export const updateEditionSchema = z
  .object({
    editionTitle: z.string().trim().min(1, "min1").max(150, "max150"),
    editionNumber: z.coerce.number().gt(0, "gt0"),
    editionSummary: z.string().trim().max(500, "max500"),
    pageCount: z.coerce.number().gt(0, "gt0"),
    language: z.string().trim(),
    publicationYear: z.coerce
      .number()
      .gt(0, "gt0")
      .refine((data) => data <= new Date().getFullYear(), "publicationYear"),

    isbn: isbnSchema,
    coverImage: z.string().trim().min(1, "min1"),
    //client only
    file: z.instanceof(File).optional(),
    //client only
    validImage: z.boolean().optional(),

    format: z.nativeEnum(EBookFormat),
    publisher: z.string().trim().min(1, "min1"),

    estimatedPrice: z.coerce.number().gt(0, "gt0"),
    shelfId: z.coerce.number().optional(),
  })
  .refine((data) => data.validImage, {
    message: "validImageAI",
    path: ["coverImage"],
  })

export type TUpdateEditionSchema = z.infer<typeof updateEditionSchema>
