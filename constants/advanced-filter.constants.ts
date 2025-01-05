export enum AdvancedFilterBookOption {
  TEXT = "text",
  DATE_TIME = "date",
  SELECTION = "selection",
  RANGE_NUMBER = "rangeNumber",
}

export enum AdvancedFilterBookFields {
  TITLE = "Title",
  EDITION = "Edition",
  AUTHOR = "Author",
  BOOK_FORMAT = "Book format",
  CATEGORY = "Category",
  FLOOR = "Floor",
  SHELF = "Shelf",
  AVAILABLE_QUANTITY = "Available quantity",
  PUBLISHER = "Publisher",
  PUBLICATION_YEAR = "Publication year",
  PAGE_COUNT = "Page count",
  LANGUAGE = "Language",
  ISBN = "ISBN",
  COPY_CODE = "Copy Code",
}

export type AdvancedFilterBookField = {
  id: AdvancedFilterBookFields
  field: AdvancedFilterBookFields
  type: AdvancedFilterBookOption
  isShown: boolean
}

export const AdvancedFilterBookConstants: AdvancedFilterBookField[] = [
  {
    id: AdvancedFilterBookFields.TITLE,
    field: AdvancedFilterBookFields.TITLE,
    type: AdvancedFilterBookOption.TEXT,
    isShown: false,
  },
  {
    id: AdvancedFilterBookFields.EDITION,
    field: AdvancedFilterBookFields.EDITION,
    type: AdvancedFilterBookOption.RANGE_NUMBER,
    isShown: false,
  },
  {
    id: AdvancedFilterBookFields.AUTHOR,
    field: AdvancedFilterBookFields.AUTHOR,
    type: AdvancedFilterBookOption.TEXT,
    isShown: false,
  },
  {
    id: AdvancedFilterBookFields.BOOK_FORMAT,
    field: AdvancedFilterBookFields.BOOK_FORMAT,
    type: AdvancedFilterBookOption.SELECTION,
    isShown: false,
  },
  {
    id: AdvancedFilterBookFields.CATEGORY,
    field: AdvancedFilterBookFields.CATEGORY,
    type: AdvancedFilterBookOption.SELECTION,
    isShown: false,
  },
  {
    id: AdvancedFilterBookFields.FLOOR,
    field: AdvancedFilterBookFields.FLOOR,
    type: AdvancedFilterBookOption.SELECTION,
    isShown: false,
  },
  {
    id: AdvancedFilterBookFields.SHELF,
    field: AdvancedFilterBookFields.SHELF,
    type: AdvancedFilterBookOption.SELECTION,
    isShown: false,
  },
  {
    id: AdvancedFilterBookFields.AVAILABLE_QUANTITY,
    field: AdvancedFilterBookFields.AVAILABLE_QUANTITY,
    type: AdvancedFilterBookOption.RANGE_NUMBER,
    isShown: false,
  },
  {
    id: AdvancedFilterBookFields.PUBLISHER,
    field: AdvancedFilterBookFields.PUBLISHER,
    type: AdvancedFilterBookOption.TEXT,
    isShown: false,
  },
  {
    id: AdvancedFilterBookFields.PUBLICATION_YEAR,
    field: AdvancedFilterBookFields.PUBLICATION_YEAR,
    type: AdvancedFilterBookOption.RANGE_NUMBER,
    isShown: false,
  },
  {
    id: AdvancedFilterBookFields.PAGE_COUNT,
    field: AdvancedFilterBookFields.PAGE_COUNT,
    type: AdvancedFilterBookOption.RANGE_NUMBER,
    isShown: false,
  },
  {
    id: AdvancedFilterBookFields.LANGUAGE,
    field: AdvancedFilterBookFields.LANGUAGE,
    type: AdvancedFilterBookOption.SELECTION,
    isShown: false,
  },
  {
    id: AdvancedFilterBookFields.ISBN,
    field: AdvancedFilterBookFields.ISBN,
    type: AdvancedFilterBookOption.TEXT,
    isShown: false,
  },
  {
    id: AdvancedFilterBookFields.COPY_CODE,
    field: AdvancedFilterBookFields.COPY_CODE,
    type: AdvancedFilterBookOption.TEXT,
    isShown: false,
  },
]
