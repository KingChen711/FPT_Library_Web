import { EAdvancedFilterType } from "./advance-search/common"

// LibraryCard (text)
// Title (text)
// ISBN (multi-text) - combined with ','
// ClassificationNumber(DDC) (text)
// CutterNumber (text)
// Genres (multi-text) - combined with ','
// TopicalTerms (multi-text) - combined with ','
// Category (multi-text) - combined with ','
// ShelfNumber (multi-text) - combined with ','
// Barcode (multi-text) - combined with ','

export enum EAdvancedFilterBorrowRequestField {
  LIBRARY_CARD = "libraryCard",
  TITLE = "title",
  ISBN = "isbn",
  CLASSIFICATION_NUMBER = "classificationNumber",
  CUTTER_NUMBER = "cutterNumber",
  GENRES = "genres",
  TOPICAL_TERMS = "topicalTerms",
  CATEGORY = "category",
  SHELF_NUMBER = "shelfNumber",
  BARCODE = "barcode",
}

export const borrowRequestAdvancedFilters = [
  {
    field: EAdvancedFilterBorrowRequestField.LIBRARY_CARD,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBorrowRequestField.TITLE,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBorrowRequestField.ISBN,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBorrowRequestField.CLASSIFICATION_NUMBER,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBorrowRequestField.CUTTER_NUMBER,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBorrowRequestField.GENRES,
    type: EAdvancedFilterType.SELECT_DYNAMIC,
  },
  {
    field: EAdvancedFilterBorrowRequestField.TOPICAL_TERMS,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBorrowRequestField.CATEGORY,
    type: EAdvancedFilterType.SELECT_DYNAMIC,
  },
  {
    field: EAdvancedFilterBorrowRequestField.SHELF_NUMBER,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBorrowRequestField.BARCODE,
    type: EAdvancedFilterType.TEXT,
  },
] as const
