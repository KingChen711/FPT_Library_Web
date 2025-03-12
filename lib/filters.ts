import { format, isValid, parse } from "date-fns"

function formatDate(date: Date) {
  return date ? format(date, "yyyy-MM-dd") : JSON.stringify(null)
}

function parseDate(date: string) {
  const parsedDate = parse(date.toString(), "yyyy-MM-dd", new Date())
  return isValid(parsedDate) ? parsedDate : null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function processRangeValues<T>(values: any[], parser: (val: any) => T) {
  return values.map((value) => parser(value))
}

export const parseSearchParamsDateRange = (dateRange: string[]) =>
  processRangeValues<Date | null>(dateRange, parseDate)

export const parseSearchParamsNumRange = (numRange: string[]) =>
  processRangeValues<number | null>(numRange, (n) => Number(n) || null)

export const parseQueryDateRange = (dateRange: (Date | null)[]) =>
  processRangeValues<string | null>(dateRange, formatDate)

export const parseQueryNumRange = (numRange: (number | null)[]) =>
  processRangeValues<string | null>(numRange, (number) =>
    number ? number.toString() : JSON.stringify(null)
  )
