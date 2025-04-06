import { z } from "zod"

import { ECardStatus, EIssuanceMethod } from "@/lib/types/enums"
import {
  filterBooleanSchema,
  filterDateRangeSchema,
  filterEnumSchema,
} from "@/lib/zod"

export enum Column {
  // Thông tin về thẻ thư viện
  BARCODE = "Barcode", // mã vạch trên thẻ
  FULLNAME_ON_CARD = "Name on card",
  AVATAR = "Avatar on card",
  CARD_STATUS = "Card status",
  ISSUANCE_METHOD = "Issuance method", // tại thư viện (do thủ thư tạo) hoặc online (do người dùng tạo)
  ISSUE_DATE = "Issue date",
  EXPIRY_DATE = "Expiry date",
  ALLOW_BORROW_MORE = "Allow borrow more",
  MAX_ITEM_ONCE_TIME = "Max item once time",
  ALLOW_BORROW_MORE_REASON = "Allow borrow more reason",
  TOTAL_MISSED_PICK_UP = "Total missed pick up",
  REMINDER_SENT = "Reminder sent",
  EXTENDED = "Extended",
  EXTENSION_COUNT = "Extension count",
  SUSPENSION_END_DATE = "Suspension end date",
  SUSPENSION_REASON = "Suspension reason",
  REJECT_REASON = "Reject reason",
  TRANSACTION_CODE = "Transaction code",
  ARCHIVED = "Archived",
  ARCHIVE_REASON = "Archive reason",
}

export const defaultColumns: Column[] = [
  Column.BARCODE,
  Column.FULLNAME_ON_CARD,
  Column.CARD_STATUS,
  Column.ISSUE_DATE,
  Column.EXPIRY_DATE,
  Column.MAX_ITEM_ONCE_TIME,
  Column.TOTAL_MISSED_PICK_UP,
  Column.EXTENDED,
  Column.SUSPENSION_END_DATE,
]

export const filterCardSchema = z.object({
  isAllowBorrowMore: filterBooleanSchema(),
  isReminderSent: filterBooleanSchema(),
  isExtended: filterBooleanSchema(),
  isArchived: filterBooleanSchema(),

  issuanceMethod: filterEnumSchema(EIssuanceMethod),
  status: filterEnumSchema(ECardStatus),

  issueDateRange: filterDateRangeSchema,
  expiryDateRange: filterDateRangeSchema,
  suspensionDateRange: filterDateRangeSchema,
})

export type TFilterCardSchema = z.infer<typeof filterCardSchema>

export const searchCardsSchema = z
  .object({
    columns: z.array(z.nativeEnum(Column)).catch(defaultColumns),
    tab: z.enum(["Active", "Archived"]).catch("Active"),
    search: z.string().catch(""),
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("5"),
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
    isArchived: z.boolean().optional(),
  })
  .and(filterCardSchema)
  .transform((data) => {
    data.isArchived = data.tab === "Archived"
    return data
  })

export type TSearchCardsSchema = z.infer<typeof searchCardsSchema>
