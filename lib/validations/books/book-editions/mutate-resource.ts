import { z } from "zod"

import { EResourceBookType } from "@/lib/types/enums"

export const mutateResourceSchema = z
  .object({
    resourceTitle: z.string().trim().min(1, "min1").max(255, "max255"),
    resourceType: z.nativeEnum(EResourceBookType),
    resourceSize: z.coerce.number().int("integer"),
    provider: z.string().trim().catch("Cloudinary"),
    resourceUrl: z.string().optional(),
    providerPublicId: z.string().trim().optional(),
    fileFormat: z.string().trim().optional(),
    defaultBorrowDurationDays: z.coerce.number().int("integer").gt(0, "gt0"),
    borrowPrice: z.coerce.number().gt(0, "gt0"),
    //client only, check require on validate only, not on initial, so we use optional
    fileEbook: z.any(),
    fileAudioBook: z.any(),
  })
  .transform((data) => {
    data.fileFormat =
      data.resourceType === EResourceBookType.AUDIO_BOOK ? "Video" : "Image"
    return data
  })
  .refine(
    (data) =>
      data.resourceType === EResourceBookType.AUDIO_BOOK ||
      data.fileEbook ||
      data.resourceUrl,
    { message: "required", path: ["fileEbook"] }
  )
  .refine(
    (data) =>
      data.resourceType === EResourceBookType.EBOOK ||
      data.fileAudioBook ||
      data.resourceUrl,
    { message: "required", path: ["fileAudioBook"] }
  )

export type TMutateResourceSchema = z.infer<typeof mutateResourceSchema>
