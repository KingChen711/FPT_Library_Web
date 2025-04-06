import { z } from "zod"

import { ECardStatus, EIdxGender, EIssuanceMethod } from "@/lib/types/enums"
import {
  filterBooleanSchema,
  filterDateRangeSchema,
  filterEnumSchema,
} from "@/lib/zod"

export enum Column {
  // Thông tin chung về người dùng
  FULLNAME = "Fullname",
  EMAIL = "Email",
  PHONE = "Phone",
  DOB = "Dob",
  GENDER = "Gender",
  ADDRESS = "Address",
  STATUS = "Status", // trạng thái tài khoản thư viện
  TYPE = "Type", // được tạo bởi nhân viên hay tự tạo
  CREATED_AT = "Created at",
  MODIFIED_DATE = "Modified date",
  MODIFIED_BY = "Modified by",

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
  Column.FULLNAME,
  Column.EMAIL,
  Column.PHONE,
  Column.STATUS,
  Column.CARD_STATUS,
  Column.ISSUE_DATE,
  Column.EXPIRY_DATE,
]

export const filterPatronSchema = z.object({
  gender: filterEnumSchema(EIdxGender),
  issuanceMethod: filterEnumSchema(EIssuanceMethod),
  cardStatus: filterEnumSchema(ECardStatus),

  isAllowBorrowMore: filterBooleanSchema(),
  isReminderSent: filterBooleanSchema(),
  isExtended: filterBooleanSchema(),
  isArchived: filterBooleanSchema(),

  cardIssueDateRange: filterDateRangeSchema,
  cardExpiryDateRange: filterDateRangeSchema,
  suspensionDateRange: filterDateRangeSchema,
  dobRange: filterDateRangeSchema,
})

export type TFilterPatronSchema = z.infer<typeof filterPatronSchema>

export const searchPatronsSchema = z
  .object({
    columns: z.array(z.nativeEnum(Column)).catch(defaultColumns),
    tab: z.enum(["Active", "Deleted"]).catch("Active"),
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
    isDeleted: z.boolean().optional(),
  })
  .and(filterPatronSchema)
  .transform((data) => {
    data.isDeleted = data.tab === "Deleted"
    return data
  })

export type TSearchPatronsSchema = z.infer<typeof searchPatronsSchema>
