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

export const trainGroupSchema = z.object({
  id: z.string(),
  groupName: z.string(),
  books: z.array(
    z.object({
      title: z.string(),
      isbn: z.string(),
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
              hash: z.string().optional(),

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
        .min(5, { message: "imagesMin5" }),
    })
  ),
})

export type TTrainGroupSchema = z.infer<typeof trainGroupSchema>

export const trainGroupsSchema = z.object({
  groups: z.array(trainGroupSchema),
})

export type TTrainGroupsSchema = z.infer<typeof trainGroupsSchema>
