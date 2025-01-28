import { z } from "zod"

export const isbnSchema = z.string().trim()

// export const isbnSchema = z
//   .string()
//   .trim()
//   .transform((data) => data.replace("-", ""))
//   .refine(
//     (value) =>
//       /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(value) &&
//       isValidISBN(value),
//     {
//       message: "isbn",
//     }
//   )

export function isValidISBN(isbn: string): boolean {
  // Remove any hyphens (not typically part of raw ISBN input)
  const cleanedISBN = isbn.replace(/-/g, "")

  // Validate ISBN-10 checksum
  if (cleanedISBN.length === 10) {
    const checksum = cleanedISBN
      .split("")
      .slice(0, 9)
      .reduce((acc, digit, idx) => acc + parseInt(digit) * (10 - idx), 0)
    const checkDigit =
      cleanedISBN[9].toUpperCase() === "X" ? 10 : parseInt(cleanedISBN[9])
    return (checksum + checkDigit) % 11 === 0
  }

  // Validate ISBN-13 checksum
  if (cleanedISBN.length === 13) {
    const checksum = cleanedISBN
      .split("")
      .slice(0, 12)
      .reduce(
        (acc, digit, idx) => acc + parseInt(digit) * (idx % 2 === 0 ? 1 : 3),
        0
      )
    const checkDigit = 10 - (checksum % 10)
    return parseInt(cleanedISBN[12]) === (checkDigit === 10 ? 0 : checkDigit)
  }

  return false
}
