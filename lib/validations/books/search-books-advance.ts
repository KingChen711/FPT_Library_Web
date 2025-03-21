import { z } from "zod"

import { ESearchType } from "@/lib/types/enums"
import { filterBooleanSchema, filterEnumSchema } from "@/lib/zod"

enum Keyword {
  TITLE,
  AUTHOR,
  ISBN,
  CLASSIFICATION_NUMBER,
  GENRES,
  PUBLISHER,
  TOPICAL_TERMS,
}

export enum Column {
  // Basic info
  COVER_IMAGE = "coverImage",
  TITLE = "title",
  SUBTITLE = "subTitle",
  AUTHORS = "authors",
  ADDITIONAL_AUTHORS = "additionalAuthors",
  RESPONSIBILITY = "responsibility",

  // Edition info
  EDITION = "edition",
  EDITION_NUMBER = "editionNumber",
  LANGUAGE = "language",
  ORIGIN_LANGUAGE = "originLanguage",
  PUBLICATION_YEAR = "publicationYear",
  PUBLISHER = "publisher",
  PUBLICATION_PLACE = "publicationPlace",

  // Classification
  CLASSIFICATION_NUMBER = "classificationNumber",
  CUTTER_NUMBER = "cutterNumber",
  SHELF = "shelf",
  CATEGORY = "category",

  // Identifiers
  ISBN = "isbn",
  EAN = "ean",

  // Physical details
  PAGE_COUNT = "pageCount",
  PHYSICAL_DETAILS = "physicalDetails",
  DIMENSIONS = "dimensions",
  ACCOMPANYING_MATERIAL = "accompanyingMaterial",
  ESTIMATED_PRICE = "estimatedPrice",

  // Content info
  SUMMARY = "summary",
  GENRES = "genres",
  TOPICAL_TERMS = "topicalTerms",
  GENERAL_NOTE = "generalNote",
  BIBLIOGRAPHICAL_NOTE = "bibliographicalNote",

  // Status
  STATUS = "status",
  CAN_BORROW = "canBorrow",
  IS_TRAINED = "isTrained",
  TRAINED_AT = "trainedAt",

  // Metadata
  AVG_REVIEWED_RATE = "avgReviewedRate",
  CREATED_AT = "createdAt",
  CREATED_BY = "createdBy",
  UPDATED_AT = "updatedAt",
  UPDATED_BY = "updatedBy",
}

export const defaultColumns = [
  Column.COVER_IMAGE,
  Column.TITLE,
  Column.AUTHORS,
  Column.ISBN,
  Column.STATUS,
  Column.CAN_BORROW,
  Column.SHELF,
]

export const searchBooksAdvanceFilterSchema = z.object({
  searchWithKeyword: filterEnumSchema(Keyword),

  title: z
    .string()
    .optional()
    .catch(undefined)
    .transform((data) => data || undefined),
  author: z.coerce
    .number()
    .optional()
    .catch(undefined)
    .transform((data) => data ?? undefined),
  isbn: z.coerce
    .number()
    .optional()
    .catch(undefined)
    .transform((data) => data ?? undefined),
  classificationNumber: z.coerce
    .number()
    .optional()
    .catch(undefined)
    .transform((data) => data ?? undefined),
  genres: z
    .string()
    .optional()
    .catch(undefined)
    .transform((data) => data || undefined),
  publisher: z
    .string()
    .optional()
    .catch(undefined)
    .transform((data) => data || undefined),
  topicalTerms: z
    .string()
    .optional()
    .catch(undefined)
    .transform((data) => data || undefined),

  f: z
    .array(z.string())
    .or(z.string())
    .transform((data) => (Array.isArray(data) ? data : [data]))
    .catch([]),
  o: z
    .array(z.string())
    .or(z.string())
    .transform((data) => (Array.isArray(data) ? data : [data]))
    .catch([]),
  v: z
    .array(z.string())
    .or(z.string())
    .transform((data) => (Array.isArray(data) ? data : [data]))
    .catch([]),
})

export type TSearchBooksAdvanceFilterSchema = z.infer<
  typeof searchBooksAdvanceFilterSchema
>

export const searchBooksAdvanceSchema = z
  .object({
    columns: z.array(z.nativeEnum(Column)).catch(defaultColumns),
    search: z.string().catch(""),
    searchType: filterEnumSchema(ESearchType),
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("10"),
    sort: z
      .enum([
        "Title",
        "-Title",
        "SubTitle",
        "-SubTitle",
        "PublicationYear",
        "-PublicationYear",
        "CutterNumber",
        "-CutterNumber",
        "ClassificationNumber",
        "-ClassificationNumber",
        "PageCount",
        "-PageCount",
        "EstimatedPrice",
        "-EstimatedPrice",
        "TrainedAt",
        "-TrainedAt",
        "AvgReviewedRate",
        "-AvgReviewedRate",
        "CreatedAt",
        "-CreatedAt",
        "UpdatedAt",
        "-UpdatedAt",
      ])
      .optional()
      .catch(undefined),
    isMatchExact: filterBooleanSchema("false"),
    searchWithSpecial: filterBooleanSchema("true"),
    tab: z.enum(["Active", "Deleted"]).catch("Active"),
    isDeleted: z.boolean().optional(),
    isTrained: filterBooleanSchema(),
    canBorrow: filterBooleanSchema(),
  })
  .and(searchBooksAdvanceFilterSchema)
  .transform((data) => {
    data.isDeleted = data.tab === "Deleted"
    return data
  })

export type TSearchBooksAdvanceSchema = z.infer<typeof searchBooksAdvanceSchema>
