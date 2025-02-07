import { z } from "zod"

export const imageSchema = z
  .object({
    coverImage: z.string().trim().min(1, "min1").optional(),
    //client only
    file: z.instanceof(File).optional(),
    //client only
    validImage: z.boolean().optional(),

    //client only
    checkedResult: z
      .object({
        totalPoint: z.number(),
        confidenceThreshold: z.number(),
        fieldPointsWithThreshole: z.array(
          z.object({
            name: z.string(),
            detail: z.string(),
            matchedPoint: z.number(),
            isPassed: z.boolean(),
          })
        ),
      })
      .optional(),
  })
  .refine((data) => !!data.validImage, {
    message: "validImageAI",
    path: ["coverImage"],
  })

export type TImageSchema = z.infer<typeof imageSchema>

export const trainBookInProgressSchema = z.object({
  bookCode: z.string().trim(),
  imageList: z
    .array(
      z
        .object({
          coverImage: z.string().trim().min(1, "min1").optional(),
          //client only
          file: z.instanceof(File).optional(),
          //client only
          validImage: z.boolean().optional(),

          //client only
          checkedResult: z
            .object({
              totalPoint: z.number(),
              confidenceThreshold: z.number(),
              fieldPointsWithThreshole: z.array(
                z.object({
                  name: z.string(),
                  detail: z.string(),
                  matchedPoint: z.number(),
                  isPassed: z.boolean(),
                })
              ),
            })
            .optional(),
        })
        .refine((data) => !!data.validImage, {
          message: "validImageAI",
          path: ["coverImage"],
        })
    )
    .min(4, { message: "imagesMin4" }),
})

export type TTrainBookInProgressSchema = z.infer<
  typeof trainBookInProgressSchema
>
