import { EAdvancedFilterType } from "./advance-search/common"

export enum EAdvancedFilterTrackingDetailField {
  ITEM_TOTAL = "itemTotal", //number
  ISBN = "isbn", //text
  UNIT_PRICE = "unitPrice", //number
  TOTAL_AMOUNT = "totalAmount", //number
  STOCK_TRANSACTION_TYPE = "stockTransactionType", //select static
  CATEGORY = "categoryId", //select dynamic
  CONDITION = "libraryItemCondition", //select dynamic
  CREATED_AT = "createdAt", //date
  UPDATED_AT = "updatedAt", //date
}

export const trackingDetailAdvancedFilters = [
  {
    field: EAdvancedFilterTrackingDetailField.ITEM_TOTAL,
    type: EAdvancedFilterType.NUMBER,
  },
  {
    field: EAdvancedFilterTrackingDetailField.UNIT_PRICE,
    type: EAdvancedFilterType.NUMBER,
  },
  {
    field: EAdvancedFilterTrackingDetailField.TOTAL_AMOUNT,
    type: EAdvancedFilterType.NUMBER,
  },
  {
    field: EAdvancedFilterTrackingDetailField.ISBN,
    type: EAdvancedFilterType.TEXT,
  },
  {
    field: EAdvancedFilterTrackingDetailField.STOCK_TRANSACTION_TYPE,
    type: EAdvancedFilterType.SELECT_STATIC,
  },
  {
    field: EAdvancedFilterTrackingDetailField.CATEGORY,
    type: EAdvancedFilterType.SELECT_DYNAMIC,
  },
  {
    field: EAdvancedFilterTrackingDetailField.CONDITION,
    type: EAdvancedFilterType.SELECT_DYNAMIC,
  },
  {
    field: EAdvancedFilterTrackingDetailField.CREATED_AT,
    type: EAdvancedFilterType.DATE,
  },
  {
    field: EAdvancedFilterTrackingDetailField.UPDATED_AT,
    type: EAdvancedFilterType.DATE,
  },
] as const
