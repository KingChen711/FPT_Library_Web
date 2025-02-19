import { z } from "zod"

export const addItemTrackingDetailSchema = z.object({
  libraryItemId: z.coerce.number({ message: "required" }),
})

export type TAddItemTrackingDetailSchema = z.infer<
  typeof addItemTrackingDetailSchema
>
