import { z } from "zod"

export const editShelfSchema = z
  .object({
    shelfNumber: z.string(),
    classificationNumberRangeFrom: z.coerce.number(),
    classificationNumberRangeTo: z.coerce.number(),
    engShelfName: z.string({ message: "min1" }).min(1, "min1"),
    vieShelfName: z.string({ message: "min1" }).min(1, "min1"),
  })
  .refine(
    (data) =>
      data.classificationNumberRangeTo >= data.classificationNumberRangeFrom,
    {
      path: ["classificationNumberRangeTo"],
      message: "toGreaterThanFromDDC",
    }
  )

export type TEditShelfSchema = z.infer<typeof editShelfSchema>
