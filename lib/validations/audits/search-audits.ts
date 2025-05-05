import { z } from "zod"

export const searchAuditsSchema = z.object({
  search: z.string().catch(""),
  pageIndex: z.coerce.number().min(1).catch(1),
  pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("10"),
  sort: z.enum(["Email", "-Email", "DateUtc", "-DateUtc"]).catch("-DateUtc"),
  entityId: z.coerce.number().catch(0),
  entityName: z.string().catch(""),
})

export type TSearchAuditsSchema = z.infer<typeof searchAuditsSchema>
