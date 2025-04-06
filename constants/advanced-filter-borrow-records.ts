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

export enum EAdvancedFilterBorrowRecordField {
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

export const borrowRecordAdvancedFilters = [
  {
    field: EAdvancedFilterBorrowRecordField.LIBRARY_CARD,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBorrowRecordField.TITLE,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBorrowRecordField.ISBN,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBorrowRecordField.CLASSIFICATION_NUMBER,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBorrowRecordField.CUTTER_NUMBER,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBorrowRecordField.GENRES,
    type: EAdvancedFilterType.SELECT_DYNAMIC,
  },
  {
    field: EAdvancedFilterBorrowRecordField.TOPICAL_TERMS,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBorrowRecordField.CATEGORY,
    type: EAdvancedFilterType.SELECT_DYNAMIC,
  },
  {
    field: EAdvancedFilterBorrowRecordField.SHELF_NUMBER,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterBorrowRecordField.BARCODE,
    type: EAdvancedFilterType.TEXT,
  },
] as const
