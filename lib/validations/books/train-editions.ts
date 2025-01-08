import { z } from "zod"

export const trainedImageSchema = z.object({
  image: z.instanceof(File).optional(),
  invalidImage: z.boolean().optional(),
})

export const trainEditionSchema = z.object({
  editionId: z.coerce.number(),
  images: z.array(trainedImageSchema),
})

export type TTrainEditionSchema = z.infer<typeof trainEditionSchema>

export const trainEditionsSchema = z.object({
  editions: z.array(trainEditionSchema),
})

export type TTrainEditionsSchema = z.infer<typeof trainEditionsSchema>
