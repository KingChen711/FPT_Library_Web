import { z } from "zod"

import {
  EBookCopyConditionStatus,
  EBookFormat,
  EResourceBookType,
} from "@/lib/types/enums"

import { isbnSchema } from "../isbn"

export const bookCopySchema = z.object({
  barcode: z.string().trim(),
  conditionStatus: z.nativeEnum(EBookCopyConditionStatus),
})

// TODO:Fix isbn

export type TBookCopySchema = z.infer<typeof bookCopySchema>

export const bookEditionSchema = z
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

export type TBookEditionSchema = z.infer<typeof bookEditionSchema>

export const bookResourceSchema = z
  .object({
    title: z.string().trim().min(1, "min1").max(150, "max150"),
    resourceType: z.nativeEnum(EResourceBookType),
    resourceSize: z.coerce.number(),
    provider: z.string().trim().catch("Cloudinary"),
    resourceUrl: z.string().trim().min(1, "min1"),
    providerPublicId: z.string().trim().optional(),
    fileFormat: z.string().trim().optional(),
    //client only
    file: z.instanceof(File).optional(),
  })
  .refine((data) => {
    data.fileFormat =
      data.resourceType === EResourceBookType.AUDIO_BOOK ? "Video" : "Image"
    return data
  })

export type TBookResourceSchema = z.infer<typeof bookResourceSchema>

export const mutateBookSchema = z.object({
  bookCode: z.string(),
  title: z.string().trim().min(1, "min1").max(150, "max150"),
  subTitle: z.string().trim().max(100, "max100"),
  summary: z.string().trim().max(2000, "max2000"),
  categoryIds: z.array(z.coerce.number()).min(1, "categoriesMin1"),
  bookResources: z.array(bookResourceSchema),
  bookEditions: z.array(bookEditionSchema),
})

export type TMutateBookSchema = z.infer<typeof mutateBookSchema>
