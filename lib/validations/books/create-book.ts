import { z } from "zod"

import { EBookCopyConditionStatus, EResourceBookType } from "@/lib/types/enums"

export const bookCopySchema = z.object({
  barcode: z.string().trim(),
  conditionStatus: z.nativeEnum(EBookCopyConditionStatus),
})

export type TBookCopySchema = z.infer<typeof bookCopySchema>

export const bookResourceSchema = z
  .object({
    resourceTitle: z.string().trim().min(1, "min1").max(255, "max255"),
    resourceType: z.nativeEnum(EResourceBookType),
    resourceSize: z.coerce.number().int("integer"),
    provider: z.string().trim().catch("Cloudinary"),
    resourceUrl: z.string().optional(),
    providerPublicId: z.string().trim().optional(),
    fileFormat: z.string().trim().optional(),
    defaultBorrowDurationDays: z.coerce.number().int("integer").gt(0, "gt0"),
    borrowPrice: z.coerce.number().gt(0, "gt0"),
    //client only, check require on validate only, not on initial, so we use optional
    file: z.any().refine((data) => data, { message: "required" }),
  })
  .transform((data) => {
    data.fileFormat =
      data.resourceType === EResourceBookType.AUDIO_BOOK ? "Video" : "Image"
    return data
  })

export type TBookResourceSchema = z.infer<typeof bookResourceSchema>

export const bookEditionSchema = z
  .object({
    //245 a
    title: z.string().trim().min(1, "min1").max(255, "max255"),
    //245 b
    subTitle: z
      .string()
      .trim()
      .max(255, "max255")
      .optional()
      .transform((data) => (data ? data : undefined)),
    //245c
    responsibility: z
      .string()
      .trim()
      .max(155, "max155")
      .optional()
      .transform((data) => (data ? data : undefined)),
    //250 a
    edition: z
      .string()
      .trim()
      .max(155, "max155")
      .optional()
      .transform((data) => (data ? data : undefined)),
    //not in marc21
    editionNumber: z.coerce.number().int("integer").gt(0, "gt0").optional(),
    //041 a
    language: z
      .string()
      .trim()
      .max(50, "max50")
      .optional()
      .transform((data) => (data ? data : undefined)),
    //041 h
    originLanguage: z
      .string()
      .trim()
      .max(50, "max50")
      .optional()
      .transform((data) => (data ? data : undefined)),
    //520 a
    summary: z
      .string()
      .trim()
      .max(700, "max700")
      .optional()
      .transform((data) => (data ? data : undefined)),
    //260 c
    publicationYear: z.coerce
      .number()
      .int("integer")
      .gt(0, "gt0")
      .optional()
      .refine(
        (data) => !data || data <= new Date().getFullYear(),
        "publicationYear"
      ),
    //260 b
    publisher: z.string().trim().optional(),
    //260 a
    publicationPlace: z.string().trim().optional(),
    //082 a ddc
    classificationNumber: z.string().trim().optional(),
    //082 b
    cutterNumber: z.string().trim().optional(),
    //020 a
    isbn: z.string().trim().optional(),
    //024a
    ean: z.string().trim().optional(),
    //020 c
    estimatedPrice: z.coerce
      .number()
      .gt(0, "gt0")
      .lte(9999999999, "lte9999999999")
      .optional(),
    //300 a
    pageCount: z.coerce
      .number()
      .int("integer")
      .gt(0, "gt0")
      .lte(2147483647, "lte2147483647")
      .optional(),
    //300 b
    physicalDetails: z
      .string()
      .trim()
      .max(100, "max100")
      .optional()
      .transform((data) => (data ? data : undefined)),
    //300 c
    dimensions: z
      .string()
      .trim()
      .max(50, "max50")
      .optional()
      .transform((data) => (data ? data : undefined)),
    //300 e
    accompanyingMaterial: z
      .string()
      .trim()
      .max(50, "max50")
      .optional()
      .transform((data) => (data ? data : undefined)),
    //655 a
    genres: z
      .string()
      .trim()
      .max(255, "max255")
      .optional()
      .transform((data) => (data ? data : undefined)),
    //500 a
    generalNote: z
      .string()
      .trim()
      .max(100, "max100")
      .optional()
      .transform((data) => (data ? data : undefined)),
    //504 a
    bibliographicalNote: z
      .string()
      .trim()
      .max(100, "max100")
      .optional()
      .transform((data) => (data ? data : undefined)),
    //650 a
    topicalTerms: z
      .string()
      .trim()
      .max(500, "max500")
      .optional()
      .transform((data) => (data ? data : undefined)),
    //700a,e
    additionalAuthors: z
      .string()
      .trim()
      .max(500, "max500")
      .optional()
      .transform((data) => (data ? data : undefined)),

    coverImage: z.string().trim().min(1, "min1").optional(),
    //client only
    file: z.instanceof(File).optional(),
    //client only
    validImage: z.boolean().optional(),

    //client only
    checkedResult: z
      .object({
        totalPoint: z.number(),
        confidenceThreshold: z.number(),
        fieldPointsWithThreshole: z.array(
          z.object({
            name: z.string(),
            detail: z.string(),
            matchedPoint: z.number(),
            isPassed: z.boolean(),
          })
        ),
      })
      .optional(),

    categoryId: z.coerce.number({ message: "required" }),
    authorIds: z.array(z.coerce.number()).optional(),
    libraryResources: z.array(bookResourceSchema),
    libraryItemInstances: z.array(bookCopySchema).min(1, "copiesMin1"),

    //100 a, only get from marc21, no input on UI
    author: z.string().optional(),
  })
  .transform((data) => {
    data.authorIds =
      data.authorIds && data.authorIds.length > 0 ? data.authorIds : undefined
    return data
  })
  .refine((data) => !data.file || data.validImage, {
    message: "validImageAI",
    path: ["coverImage"],
  })

export type TBookEditionSchema = z.infer<typeof bookEditionSchema>
