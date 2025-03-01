import { z } from "zod"

import { ECardStatus, EIdxGender, EIssuanceMethod } from "@/lib/types/enums"

export const filterPatronSchema = z.object({
  gender: z.nativeEnum(EIdxGender).optional().catch(undefined),
  issuanceMethod: z.nativeEnum(EIssuanceMethod).optional().catch(undefined),
  cardStatus: z.nativeEnum(ECardStatus).optional().catch(undefined),

  isAllowBorrowMore: z
    .enum(["true", "false"])
    .optional()
    .catch(undefined)
    .transform((data) => (data === undefined ? undefined : data === "true")),
  isReminderSent: z
    .enum(["true", "false"])
    .optional()
    .catch(undefined)
    .transform((data) => (data === undefined ? undefined : data === "true")),
  isExtended: z
    .enum(["true", "false"])
    .optional()
    .catch(undefined)
    .transform((data) => (data === undefined ? undefined : data === "true")),
  isArchived: z
    .enum(["true", "false"])
    .optional()
    .catch(undefined)
    .transform((data) => (data === undefined ? undefined : data === "true")),

  cardIssueDateRange: z.array(z.date().or(z.null())).catch([null, null]),
  cardExpiryDateRange: z.array(z.date().or(z.null())).catch([null, null]),
  suspensionDateRange: z.array(z.date().or(z.null())).catch([null, null]),
  dobRange: z.array(z.date().or(z.null())).catch([null, null]),
})

export type TFilterPatronSchema = z.infer<typeof filterPatronSchema>

export const searchPatronsSchema = z
  .object({
    tab: z.enum(["Active", "Deleted"]).catch("Active"),
    search: z.string().catch(""),
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("10"),
    sort: z
      .enum([
        "Email",
        "-Email",
        "Phone",
        "-Phone",
        "Address",
        "-Address",
        "Gender",
        "-Gender",
        "Dob",
        "-Dob",
        "CreateDate",
        "-CreateDate",
        "ModifiedDate",
        "-ModifiedDate",
        "FullName",
        "-FullName",
        "BarCode",
        "-BarCode",
        "MaxItemOnceTime",
        "-MaxItemOnceTime",
        "TotalMissedPickup",
        "-TotalMissedPickup",
        "ExtensionCount",
        "-ExtensionCount",
        "IssueDate",
        "-IssueDate",
        "ExpiryDate",
        "-ExpiryDate",
        "SuspensionEndDate",
        "-SuspensionEndDate",
      ])
      .optional()
      .catch(undefined),
    isDeleted: z.boolean().optional(),
  })
  .and(filterPatronSchema)
  .transform((data) => {
    data.isDeleted = data.tab === "Deleted"
    return data
  })

export type TSearchPatronsSchema = z.infer<typeof searchPatronsSchema>
