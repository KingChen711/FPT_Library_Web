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

export enum EAdvancedFilterBorrowDigitalField {
  RESOURCE_TYPE = "resourceType",
  RESOURCE_SIZE = "resourceSize",
  DEFAULT_BORROW_DURATION_DAYS = "defaultBorrowDurationDays",
  BORROW_PRICE = "borrowPrice",
}

export const borrowDigitalAdvancedFilters = [
  {
    field: EAdvancedFilterBorrowDigitalField.RESOURCE_TYPE,
    type: EAdvancedFilterType.SELECT_STATIC,
  },
  {
    field: EAdvancedFilterBorrowDigitalField.RESOURCE_SIZE,
    type: EAdvancedFilterType.NUMBER,
  },
  {
    field: EAdvancedFilterBorrowDigitalField.DEFAULT_BORROW_DURATION_DAYS,
    type: EAdvancedFilterType.NUMBER,
  },
  {
    field: EAdvancedFilterBorrowDigitalField.BORROW_PRICE,
    type: EAdvancedFilterType.NUMBER,
  },
] as const
