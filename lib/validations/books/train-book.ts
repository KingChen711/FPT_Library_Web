import { z } from "zod"

export const editionImageSchema = z
  .array(
    z.object({
      url: z.string(),
      file: z.instanceof(File).optional(),
      validImage: z.boolean().optional(),
    })
  )
  .min(4, "imagesMin4")

export type TEditionImageSchema = z.infer<typeof editionImageSchema>

export const trainBookSchema = z.object({
  bookCode: z.string().trim(),
  editionImages: z.array(editionImageSchema),
})

export type TTrainBookSchema = z.infer<typeof trainBookSchema>
