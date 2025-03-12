import { isValid, parse } from "date-fns"
import { z } from "zod"

export const filterEnumSchema = <T extends Record<string, string | number>>(
  enumObj: T
) =>
  z
    .enum(
      Object.values(enumObj)
        .filter((e): e is number => typeof e === "number")
        .map((e) => e.toString()) as [string, ...string[]]
    )
    .optional()
    .catch(undefined)

export const filterNumRangeSchema = z
  .array(z.coerce.string().or(z.null()))
  .transform((data) =>
    data.map((n) => {
      if (n === "null") return null
      const num = Number(n)
      return num || null
    })
  )
  .catch([null, null])

export const filterDateRangeSchema = z
  .array(z.string().or(z.null()).or(z.date()))
  .transform((dateRange) =>
    dateRange.map((date) => {
      console.log({ hello: date })

      if (date === "null" || !date) return null

      if (date instanceof Date) return date

      const parsedDate = parse(date.toString(), "yyyy-MM-dd", new Date())

      return isValid(parsedDate) ? parsedDate : null
    })
  )
  .catch([null, null])
