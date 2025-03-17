//common
export enum EAdvancedFilterType {
  TEXT,
  NUMBER,
  DATE,
  SELECT_STATIC,
  SELECT_DYNAMIC,
}

export enum EFilterOperator {
  INCLUDES,
  EQUALS,
  NOT_EQUALS_TO,
  LESS_THAN,
  LESS_THAN_OR_EQUALS_TO,
  GREATER_THAN,
  GREATER_THAN_OR_EQUALS_TO,
}

export const defaultO = {
  [EAdvancedFilterType.TEXT]: EFilterOperator.INCLUDES,
  [EAdvancedFilterType.NUMBER]: EFilterOperator.EQUALS,
  [EAdvancedFilterType.DATE]: EFilterOperator.EQUALS,
  [EAdvancedFilterType.SELECT_DYNAMIC]: EFilterOperator.EQUALS,
  [EAdvancedFilterType.SELECT_STATIC]: EFilterOperator.EQUALS,
}

export const defaultV = {
  [EAdvancedFilterType.TEXT]: "",
  [EAdvancedFilterType.NUMBER]: 0,
  [EAdvancedFilterType.DATE]: [null, null] as [Date | null, Date | null],
  [EAdvancedFilterType.SELECT_STATIC]: 0,
  [EAdvancedFilterType.SELECT_DYNAMIC]: 1,
}

export const operators = {
  [EAdvancedFilterType.TEXT]: [
    EFilterOperator.INCLUDES,
    EFilterOperator.EQUALS,
    EFilterOperator.NOT_EQUALS_TO,
  ],
  [EAdvancedFilterType.NUMBER]: [
    EFilterOperator.EQUALS,
    EFilterOperator.NOT_EQUALS_TO,
    EFilterOperator.LESS_THAN,
    EFilterOperator.LESS_THAN_OR_EQUALS_TO,
    EFilterOperator.GREATER_THAN,
    EFilterOperator.GREATER_THAN_OR_EQUALS_TO,
  ],
  [EAdvancedFilterType.DATE]: [],
  [EAdvancedFilterType.SELECT_STATIC]: [
    EFilterOperator.EQUALS,
    EFilterOperator.NOT_EQUALS_TO,
  ],
  [EAdvancedFilterType.SELECT_DYNAMIC]: [
    EFilterOperator.EQUALS,
    EFilterOperator.NOT_EQUALS_TO,
  ],
}
