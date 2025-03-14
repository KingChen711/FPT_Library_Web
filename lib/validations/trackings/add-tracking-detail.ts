import { z } from "zod"

import { EStockTransactionType } from "@/lib/types/enums"

export const libraryItemSchema = z
  .object({
    //245 a
    title: z.string().trim().min(1, "min1").max(255, "max255").optional(),
    //245 b
    subTitle: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data))
      .refine((data) => data === undefined || data.length <= 255, {
        message: "max255",
      }),
    //245c
    responsibility: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data))
      .refine((data) => data === undefined || data.length <= 155, {
        message: "max155",
      }),
    //250 a
    edition: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data))
      .refine((data) => data === undefined || data.length <= 155, {
        message: "max155",
      }),
    //not in marc21
    editionNumber: z.coerce.number().int("integer").gt(0, "gt0").optional(),
    //041 a
    language: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data))
      .refine((data) => data === undefined || data.length <= 50, {
        message: "max50",
      }),
    //041 h
    originLanguage: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data))
      .refine((data) => data === undefined || data.length <= 50, {
        message: "max50",
      }),
    //520 a
    summary: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data))
      .refine((data) => data === undefined || data.length <= 700, {
        message: "max700",
      }),
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
    publisher: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data)),
    //260 a
    publicationPlace: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data)),
    //082 a ddc
    classificationNumber: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data)),
    //082 b
    cutterNumber: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data)),
    //020 a
    isbn: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data)),
    //024a
    ean: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data)),
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
      .optional()
      .transform((data) => (data === "" ? undefined : data))
      .refine((data) => data === undefined || data.length <= 100, {
        message: "max100",
      }),
    //300 c
    dimensions: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data))
      .refine((data) => data === undefined || data.length <= 50, {
        message: "max50",
      }),
    //300 e
    accompanyingMaterial: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data))
      .refine((data) => data === undefined || data.length <= 50, {
        message: "max50",
      }),
    //655 a
    genres: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data))
      .refine((data) => data === undefined || data.length <= 255, {
        message: "max255",
      }),
    //500 a
    generalNote: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data))
      .refine((data) => data === undefined || data.length <= 100, {
        message: "max100",
      }),
    //504 a
    bibliographicalNote: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data))
      .refine((data) => data === undefined || data.length <= 100, {
        message: "max100",
      }),
    //650 a
    topicalTerms: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data))
      .refine((data) => data === undefined || data.length <= 500, {
        message: "max500",
      }),
    //700a,e
    additionalAuthors: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data))
      .refine((data) => data === undefined || data.length <= 500, {
        message: "max500",
      }),

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

export const addTrackingDetailSchema = z
  .object({
    itemName: z.string({ message: "min1" }).trim().min(1, "min1"),
    isbn: z
      .string()
      .trim()
      .optional()
      .transform((data) => (data === "" ? undefined : data))
      .refine((data) => data === undefined || data.length >= 1, {
        message: "min1",
      }),
    itemTotal: z.coerce.number({ message: "min1" }).gt(0, "gt0"),
    unitPrice: z.coerce.number({ message: "min1" }).gt(0, "gt0"),
    totalAmount: z.coerce.number({ message: "min1" }).gt(0, "gt0"),
    conditionId: z.coerce.number({ message: "min1" }),
    categoryId: z.coerce.number({ message: "min1" }),
    stockTransactionType: z.nativeEnum(EStockTransactionType), //only NEW and ADDITIONAL are used for this form
    libraryItemId: z.coerce.number().optional(),
    libraryItem: libraryItemSchema.optional(),

    isCatalog: z.coerce.boolean(),
  })
  .refine(
    (data) =>
      data.stockTransactionType === EStockTransactionType.NEW ||
      data.libraryItemId
  )
  .refine(
    (data) =>
      data.stockTransactionType === EStockTransactionType.ADDITIONAL ||
      !data.isCatalog ||
      data.libraryItem
  )

export type TAddTrackingDetailSchema = z.infer<typeof addTrackingDetailSchema>
