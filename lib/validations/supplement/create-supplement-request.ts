import { DateTime } from "luxon"
import { z } from "zod"

export enum ESupplementRequestItemType {
  TOP_CIRCULATION,
  CUSTOM,
}

export const supplementRequestDetailSchema = z.object({
  id: z.string(),
  // Link data mẫu: https://www.googleapis.com/books/v1/volumes/BUTroQEACAAJ
  // BE đã tự hiểu những data này đã được FE dịch và truyền về
  title: z.string({ message: "min1" }).trim().min(1, "min1"),
  author: z.string({ message: "min1" }).trim().min(1, "min1"), // Nếu > 1 author -> Tên các author cách nhau = dấu phẩy
  publisher: z.string({ message: "min1" }).trim().min(1, "min1"),
  publishedDate: z.string().optional(),
  description: z.string().optional(),
  isbn: z.string().optional(), // Để null nếu kh có format "ISBN_10" hoặc "ISBN_13"
  pageCount: z.coerce.number(),
  estimatedPrice: z.coerce.number().optional(), // Giá có lúc có lúc không trong GG API, nên có thể lúc demo mình lấy giá của quyển related giá ước chừng
  dimensions: z.string().optional(),
  categories: z.string().optional(),
  language: z.string().optional(),
  averageRating: z
    .number()
    .optional()
    .transform((data) => (data ? data : null)), // Để null nếu kh có
  ratingsCount: z
    .number()
    .optional()
    .transform((data) => (data ? data : null)), // Để null nếu kh có
  // imageLinks -> thumbnail. Hình trên API rất nhỏ chỉ tầm 130 x 200 -> Có thể FE tự động tăng size khi get detail sau
  coverImageLink: z.string().optional(),
  previewLink: z.string().optional(),
  infoLink: z.string().optional(),
  // Cái này cực quan trọng. Nó xác định xem cái item mà GG recommend là cho tài liệu nào đã có sẵn trên hệ thống
  // Nên bắt đầu trước từ warehouseTrackingDetails -> sau đó lấy đc các item mà có data cho là nên nhập thêm -> sau đó mới gọi recommend cho các cuốn đó
  // Theo flow từ trên xuống, 1 WH detail - tức 1 item thì có thể có nhiều supplementRequestDetails (nhiều itemId trùng)
  relatedLibraryItemId: z.coerce.number(),

  supplementRequestReason: z
    .string({ message: "min1" })
    .trim()
    .min(5, "min5")
    .refine((data) => data.length >= 5, {
      message: "min5",
    })
    .refine((data) => data.length <= 255, {
      message: "max255",
    }),
})

export const warehouseTrackingDetailSchema = z.object({
  type: z.nativeEnum(ESupplementRequestItemType),
  libraryItemId: z.coerce.number().optional(),
  itemName: z.string({ message: "min1" }).trim().min(1, "min1"),
  itemTotal: z.coerce.number({ message: "min1" }).gt(0, "gt0"),
  isbn: z
    .string()
    .trim()
    .optional()
    .transform((data) => (data === "" ? undefined : data))
    .refine((data) => data === undefined || data.length >= 1, {
      message: "min1",
    }),
  hasInitPrice: z.boolean(),
  unitPrice: z.coerce.number({ message: "min1" }).gt(0, "gt0"),
  totalAmount: z.coerce.number({ message: "min1" }).gt(0, "gt0"),
  conditionId: z.coerce.number({ message: "min1" }),
  categoryId: z.coerce.number({ message: "min1" }),

  supplementRequestReason: z
    .string({ message: "min1" })
    .trim()
    .min(5, "min5")
    .refine((data) => data.length >= 5, {
      message: "min5",
    })
    .refine((data) => data.length <= 255, {
      message: "max255",
    }),

  borrowSuccessCount: z.number().optional(),
  borrowRequestCount: z.number().optional(),
  borrowFailedCount: z.number().optional(),
  totalSatisfactionUnits: z.number().optional(),
  availableUnits: z.number().optional(),
  needUnits: z.number().optional(),
  averageNeedSatisfactionRate: z.number().optional(),
  borrowExtensionRate: z.number().optional(),
})

export type TWarehouseTrackingDetailSchema = z.infer<
  typeof warehouseTrackingDetailSchema
>

export const createSupplementRequestSchema = z.object({
  //client not edit, auto calculate
  totalItem: z.coerce.number({ message: "required" }).gt(0, "gt0"), //
  totalAmount: z.coerce
    .number({ message: "required" })
    .gte(1000, "gte1000")
    .lte(9999999999, "lte9999999999"),
  entryDate: z
    .date({ message: "min1" })
    .transform((data) =>
      DateTime.fromJSDate(data)
        .setZone("UTC", { keepLocalTime: true })
        .toJSDate()
    ),
  dataFinalizationDate: z
    .date({ message: "min1" })
    .transform((data) =>
      DateTime.fromJSDate(data)
        .setZone("UTC", { keepLocalTime: true })
        .toJSDate()
    ),
  description: z
    .string()
    .trim()
    .optional()
    .transform((data) => (data === "" ? undefined : data))
    .refine((data) => data === undefined || data.length <= 255, {
      message: "max255",
    }), //

  warehouseTrackingDetails: z
    .array(warehouseTrackingDetailSchema)
    .min(1, "min1"),

  supplementRequestDetails: z.array(supplementRequestDetailSchema),
})

export type TCreateSupplementRequestSchema = z.infer<
  typeof createSupplementRequestSchema
>
