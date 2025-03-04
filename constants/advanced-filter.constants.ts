import { EBookEditionStatus } from "@/lib/types/enums"

export enum EAdvancedFilterType {
  TEXT,
  DATE,
  ENUM,
  NUMBER,
}

export enum EAdvancedFilterBookField {
  TITLE = "title",
  SUBTITLE = "subTitle",
  ADDITIONAL_AUTHORS = "additionalAuthors",
  RESPONSIBILITY = "responsibility",
  EDITION = "edition",
  EDITION_NUMBER = "editionNumber",
  LANGUAGE = "language",
  ORIGIN_LANGUAGE = "originLanguage",
  PUBLICATION_YEAR = "publicationYear",
  PUBLISHER = "publisher",
  PUBLICATION_PLACE = "publicationPlace",
  CLASSIFICATION_NUMBER = "classificationNumber",
  CUTTER_NUMBER = "cutterNumber",
  ISBN = "isbn",
  EAN = "ean",
  PAGE_COUNT = "pageCount",
  PHYSICAL_DETAILS = "physicalDetails",
  DIMENSIONS = "dimensions",
  ACCOMPANYING_MATERIAL = "accompanyingMaterial",
  ESTIMATED_PRICE = "estimatedPrice",
  SUMMARY = "summary",
  GENRES = "genres",
  TOPICAL_TERMS = "topicalTerms",
  GENERAL_NOTE = "generalNote",
  BIBLIOGRAPHICAL_NOTE = "bibliographicalNote",
  STATUS = "status",
  CAN_BORROW = "canBorrow",
  IS_TRAINED = "isTrained",
  TRAINED_AT = "trainedAt",
  AVG_REVIEWED_RATE = "avgReviewedRate",
  CREATED_AT = "createdAt",
  CREATED_BY = "createdBy",
  UPDATED_AT = "updatedAt",
  UPDATED_BY = "updatedBy",
  AUTHOR = "author",
  CATEGORY = "category",
  BARCODE = "barcode",
  SHELF_NUMBER = "shelfNumber",
}

export type TAdvancedFilters = {
  field: EAdvancedFilterBookField
  type: EAdvancedFilterType
  selections?: {
    label: string
    value: string | number
  }[]
}

export const advancedFilters: TAdvancedFilters[] = [
  { field: EAdvancedFilterBookField.TITLE, type: EAdvancedFilterType.TEXT },
  { field: EAdvancedFilterBookField.SUBTITLE, type: EAdvancedFilterType.TEXT },
  {
    field: EAdvancedFilterBookField.ADDITIONAL_AUTHORS,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBookField.RESPONSIBILITY,
    type: EAdvancedFilterType.TEXT,
  },
  { field: EAdvancedFilterBookField.EDITION, type: EAdvancedFilterType.TEXT },
  {
    field: EAdvancedFilterBookField.EDITION_NUMBER,
    type: EAdvancedFilterType.NUMBER,
  },

  { field: EAdvancedFilterBookField.LANGUAGE, type: EAdvancedFilterType.TEXT },

  {
    field: EAdvancedFilterBookField.ORIGIN_LANGUAGE,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBookField.PUBLICATION_YEAR,
    type: EAdvancedFilterType.NUMBER,
  },
  {
    field: EAdvancedFilterBookField.PUBLISHER,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBookField.PUBLICATION_PLACE,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBookField.CLASSIFICATION_NUMBER,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBookField.CUTTER_NUMBER,
    type: EAdvancedFilterType.TEXT,
  },
  { field: EAdvancedFilterBookField.ISBN, type: EAdvancedFilterType.TEXT },
  { field: EAdvancedFilterBookField.EAN, type: EAdvancedFilterType.TEXT },
  {
    field: EAdvancedFilterBookField.PAGE_COUNT,
    type: EAdvancedFilterType.NUMBER,
  },
  {
    field: EAdvancedFilterBookField.PHYSICAL_DETAILS,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBookField.DIMENSIONS,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBookField.ACCOMPANYING_MATERIAL,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBookField.ESTIMATED_PRICE,
    type: EAdvancedFilterType.NUMBER,
  },
  { field: EAdvancedFilterBookField.SUMMARY, type: EAdvancedFilterType.TEXT },
  { field: EAdvancedFilterBookField.GENRES, type: EAdvancedFilterType.TEXT },
  {
    field: EAdvancedFilterBookField.TOPICAL_TERMS,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBookField.GENERAL_NOTE,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBookField.BIBLIOGRAPHICAL_NOTE,
    type: EAdvancedFilterType.TEXT,
  },
  //TODO:no status in deleted tab
  {
    field: EAdvancedFilterBookField.STATUS,
    type: EAdvancedFilterType.ENUM,
    selections: [
      {
        label: "Draft",
        value: EBookEditionStatus.DRAFT,
      },
      {
        label: "Published",
        value: EBookEditionStatus.PUBLISHED,
      },
    ],
  },
  {
    field: EAdvancedFilterBookField.TRAINED_AT,
    type: EAdvancedFilterType.DATE,
  },
  {
    field: EAdvancedFilterBookField.AVG_REVIEWED_RATE,
    type: EAdvancedFilterType.NUMBER,
  },
  {
    field: EAdvancedFilterBookField.CREATED_AT,
    type: EAdvancedFilterType.DATE,
  },
  {
    field: EAdvancedFilterBookField.CREATED_BY,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBookField.UPDATED_AT,
    type: EAdvancedFilterType.DATE,
  },
  {
    field: EAdvancedFilterBookField.UPDATED_BY,
    type: EAdvancedFilterType.TEXT,
  },
  { field: EAdvancedFilterBookField.AUTHOR, type: EAdvancedFilterType.TEXT },
  //category
  { field: EAdvancedFilterBookField.CATEGORY, type: EAdvancedFilterType.TEXT },
  { field: EAdvancedFilterBookField.BARCODE, type: EAdvancedFilterType.TEXT },
  {
    field: EAdvancedFilterBookField.SHELF_NUMBER,
    type: EAdvancedFilterType.TEXT,
  },
]
