import { z } from "zod"

import { EFineType } from "@/lib/types/enums"
import { type Fine } from "@/lib/types/models"

export const processReturnSchema = z
  .object({
    //client only
    libraryCardBarcode: z.string(),

    libraryCardId: z.string(),

    isConfirmMissing: z.boolean(),

    borrowRecordDetails: z.array(
      z
        .object({
          libraryItemInstanceId: z.number(),
          returnConditionId: z.number(),

          isOverdue: z.boolean(),
          isInLibrary: z.boolean(), //borrow type
          isLost: z.boolean(),
          scanned: z.boolean(),

          borrowRecordDetailId: z.number(),

          fines: z.array(
            z.object({
              finePolicyId: z.number(),

              fine: z.any(),
              fineNote: z
                .string()
                .trim()
                .optional()
                .transform((data) => (data === "" ? undefined : data)),
            })
          ),
        })
        .refine(
          (data) =>
            !data.scanned ||
            data.returnConditionId !== 2 ||
            data.fines.some(
              (f) => (f.fine as Fine).conditionType === EFineType.DAMAGE
            ),
          {
            message: "addFineDamage",
            path: ["fines"],
          }
        )
        .refine(
          (data) =>
            !data.isLost ||
            data.fines.some(
              (f) => (f.fine as Fine).conditionType === EFineType.LOST
            ),
          {
            message: "addFineLost",
            path: ["fines"],
          }
        )
        .refine(
          (data) =>
            !data.scanned ||
            !data.isOverdue ||
            data.fines.some(
              (f) => (f.fine as Fine).conditionType === EFineType.OVER_DUE
            ),
          {
            message: "addFineOverdue",
            path: ["fines"],
          }
        )
    ),
    lostBorrowRecordDetails: z.array(
      z.object({
        borrowRecordDetailId: z.number(),
        fines: z
          .array(
            z.object({
              finePolicyId: z.number(),
              fineNote: z
                .string()
                .trim()
                .optional()
                .transform((data) => (data === "" ? undefined : data)),
            })
          )
          .min(1, "min1"),
      })
    ),

    isNeedConfirm: z.boolean(),
  })
  .refine(
    (data) =>
      data.borrowRecordDetails.some((item) => item.scanned) ||
      data.borrowRecordDetails.some((item) => item.isLost),
    { message: "atLeast1ScannedOrLost", path: ["borrowRecordDetails"] }
  )
  .refine((data) => !data.isNeedConfirm || data.isConfirmMissing, {
    message: "min1",
    path: ["isConfirmMissing"],
  })

export type TProcessReturnSchema = z.infer<typeof processReturnSchema>
