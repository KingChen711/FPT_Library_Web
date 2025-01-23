import { z } from "zod"

export const checkedResultSchema = z.object({
  totalPoint: z.number(),
  confidenceThreshold: z.number(),
  fieldPoints: z.array(
    z.object({
      name: z.string(),
      detail: z.string(),
      matchedPoint: z.number(),
      isPassed: z.boolean(),
    })
  ),
})

export type TCheckedResultSchema = z.infer<typeof checkedResultSchema>

export const editionImageSchema = z
  .array(
    z.object({
      url: z.string(),
      //client only
      file: z.instanceof(File).optional(),
      //client only
      validImage: z.boolean().optional(),
      //client only
      checkedResult: checkedResultSchema.optional(),
    })
  )
  .min(4, "imagesMin4")

export type TEditionImageSchema = z.infer<typeof editionImageSchema>

export const trainBookSchema = z.object({
  bookCode: z.string().trim(),
  editionImages: z.array(editionImageSchema),
})

export type TTrainBookSchema = z.infer<typeof trainBookSchema>
