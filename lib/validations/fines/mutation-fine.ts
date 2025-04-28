import { z } from "zod"

import { EFineType } from "@/lib/types/enums"

export const mutateFineSchema = z
  .object({
    finePolicyTitle: z.string().trim().min(1, "min1"),
    conditionType: z.nativeEnum(EFineType),
    description: z.string().trim().optional(),
    minDamagePct: z.number().gte(0, "gte0").lte(100, "lte100").optional(),
    maxDamagePct: z.number().gte(0, "gte0").lte(100, "lte100").optional(),
    processingFee: z.number().min(2000, "gte2000").optional(),
    dailyRate: z.coerce.number().min(2000, "gte2000").optional(),
    chargePct: z.coerce.number().gte(0, "gte0").lte(100, "lte100").optional(),
  })
  .refine(
    (data) =>
      data.minDamagePct === undefined ||
      data.maxDamagePct === undefined ||
      data.maxDamagePct >= data.minDamagePct,
    {
      message: "maxGteMin",
      path: ["maxDamagePct"],
    }
  )
  .refine(
    (data) =>
      data.conditionType !== EFineType.DAMAGE ||
      data.minDamagePct !== undefined,
    {
      message: "min1",
      path: ["minDamagePct"],
    }
  )
  .refine(
    (data) =>
      data.conditionType !== EFineType.DAMAGE ||
      data.maxDamagePct !== undefined,
    {
      message: "min1",
      path: ["maxDamagePct"],
    }
  )
  .refine(
    (data) =>
      data.conditionType === EFineType.OVER_DUE ||
      data.processingFee !== undefined,
    {
      message: "min1",
      path: ["processingFee"],
    }
  )
  .refine(
    (data) =>
      data.conditionType === EFineType.OVER_DUE || data.chargePct !== undefined,
    {
      message: "min1",
      path: ["chargePct"],
    }
  )
  .refine(
    (data) =>
      data.conditionType !== EFineType.OVER_DUE || data.dailyRate !== undefined,
    {
      message: "min1",
      path: ["dailyRate"],
    }
  )

export type TMutateFineSchema = z.infer<typeof mutateFineSchema>
