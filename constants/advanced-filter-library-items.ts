import { EAdvancedFilterType } from "./advance-search/common"

export enum EAdvancedFilterLibraryItemField {
  AUTHOR = "author", //text
  SHELF_NUMBER = "shelfNumber", //text
  CATEGORY = "category", //select dynamic
  BARCODE = "barcode", //text

  STATUS = "status", //select static, management only

  CREATED_AT = "createdAt", //date
  UPDATED_AT = "updatedAt", //date
  TRAINED_AT = "trainedAt", //date

  TITLE = "title", //text
  SUB_TITLE = "subTitle", //text
  RESPONSIBILITY = "responsibility", //text
  EDITION = "edition", //text
  EDITION_NUMBER = "editionNumber", //number
  LANGUAGE = "language", //text
  ORIGIN_LANGUAGE = "originLanguage", //text
  PUBLICATION_YEAR = "publicationYear", //number
  PUBLISHER = "Publisher", //text
  PUBLICATION_PLACE = "publicationPlace", //text

  CLASSIFICATION_NUMBER = "classificationNumber", //text
  CUTTER_NUMBER = "cutterNumber", //text
  ISBN = "isbn", //text
  EAN = "ean", //text
  ESTIMATED_PRICE = "estimatedPrice", //number
  PAGE_COUNT = "pageCount", //number
  PHYSICAL_DETAILS = "physicalDetails", //text
  DIMENSIONS = "dimensions", //text
  ACCOMPANYING_MATERIAL = "accompanyingMaterial", //text
  GENRES = "genres", //text
  GENERAL_NOTE = "generalNote", //text
  BIBLIOGRAPHICAL_NOTE = "bibliographicalNote", //text
  TOPICAL_TERMS = "topicalTerms", //text
  ADDITIONAL_AUTHORS = "additionalAuthors", //text
}

export const libraryItemAdvancedFilters = [
  {
    field: EAdvancedFilterLibraryItemField.AUTHOR,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterLibraryItemField.SHELF_NUMBER,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterLibraryItemField.CATEGORY,
    type: EAdvancedFilterType.SELECT_DYNAMIC,
  },
  {
    field: EAdvancedFilterLibraryItemField.BARCODE,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterLibraryItemField.STATUS,
    type: EAdvancedFilterType.SELECT_STATIC,
  },
  {
    field: EAdvancedFilterLibraryItemField.CREATED_AT,
    type: EAdvancedFilterType.DATE,
  },
  {
    field: EAdvancedFilterLibraryItemField.TITLE,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterLibraryItemField.SUB_TITLE,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterLibraryItemField.RESPONSIBILITY,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterLibraryItemField.EDITION,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterLibraryItemField.EDITION_NUMBER,
    type: EAdvancedFilterType.NUMBER,
  },
  {
    field: EAdvancedFilterLibraryItemField.LANGUAGE,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterLibraryItemField.ORIGIN_LANGUAGE,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterLibraryItemField.PUBLICATION_YEAR,
    type: EAdvancedFilterType.NUMBER,
  },
  {
    field: EAdvancedFilterLibraryItemField.PUBLICATION_PLACE,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterLibraryItemField.PUBLISHER,
    type: EAdvancedFilterType.TEXT,
  },

  {
    field: EAdvancedFilterLibraryItemField.CLASSIFICATION_NUMBER,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterLibraryItemField.CUTTER_NUMBER,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterLibraryItemField.ISBN,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterLibraryItemField.EAN,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterLibraryItemField.ESTIMATED_PRICE,
    type: EAdvancedFilterType.NUMBER,
  },
  {
    field: EAdvancedFilterLibraryItemField.PAGE_COUNT,
    type: EAdvancedFilterType.NUMBER,
  },
  {
    field: EAdvancedFilterLibraryItemField.PHYSICAL_DETAILS,
    type: EAdvancedFilterType.TEXT,
  },

  {
    field: EAdvancedFilterLibraryItemField.DIMENSIONS,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterLibraryItemField.ACCOMPANYING_MATERIAL,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterLibraryItemField.GENRES,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterLibraryItemField.GENERAL_NOTE,
    type: EAdvancedFilterType.TEXT,
  },

  {
    field: EAdvancedFilterLibraryItemField.BIBLIOGRAPHICAL_NOTE,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterLibraryItemField.TOPICAL_TERMS,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterLibraryItemField.ADDITIONAL_AUTHORS,
    type: EAdvancedFilterType.TEXT,
  },
] as const
