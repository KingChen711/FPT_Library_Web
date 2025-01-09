import { z } from "zod"

import { EBookEditionStatus } from "@/lib/types/enums"

export enum Column {
  BOOK_CODE = "bookCode",
  COVER_IMAGE = "coverImage",
  TITLE = "title",
  EDITION_TITLE = "editionTitle",
  EDITION_NUMBER = "editionNumber",
  PUBLICATION_YEAR = "publicationYear",
  ISBN = "isbn",
  AUTHOR = "author",
  LANGUAGE = "language",
  CATEGORIES = "categories",
  PUBLISHER = "publisher",
  PAGE_COUNT = "pageCount",
  SHELF = "shelf",
  FORMAT = "format",
  STATUS = "status",
  CAN_BORROW = "canBorrow",
  TOTAL_COPIES = "totalCopies",
  AVAILABLE_COPIES = "availableCopies",
  BORROWED_COPIES = "borrowedCopies",
  REQUEST_COPIES = "requestCopies",
  RESERVED_COPIES = "reservedCopies",
  CREATED_BY = "createBy",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}

export const defaultColumns = [
  Column.BOOK_CODE,
  Column.COVER_IMAGE,
  Column.EDITION_TITLE,
  Column.AUTHOR,
  Column.ISBN,
  Column.CAN_BORROW,
  Column.SHELF,
  Column.STATUS,
]

export const searchBookEditionsSchema = z
  .object({
    columns: z.array(z.nativeEnum(Column)).catch(defaultColumns),
    tab: z.enum(["Active", "Deleted"]).catch("Active"),
    search: z.string().catch(""),
    pageIndex: z.coerce.number().min(1).catch(1),
    pageSize: z.enum(["5", "10", "30", "50", "100"]).catch("10"),
    sort: z
      .enum([
        "BookCode",
        "-BookCode",
        "EditionNumber",
        "-EditionNumber",
        "PublicationYear",
        "-PublicationYear",
        "PageCount",
        "-PageCount",
        "Author",
        "-Author",
        "Title",
        "-Title",
        "EditionTitle",
        "-EditionTitle",
        "Shelf",
        "-Shelf",
        "Format",
        "-Format",
        "ISBN",
        "-ISBN",
        "Language",
        "-Language",
        "Publisher",
        "-Publisher",
        "Categories",
        "-Categories",
      ])
      .optional()
      .catch(undefined),
    status: z.nativeEnum(EBookEditionStatus).optional(),
    isDeleted: z.boolean().optional(),
  })
  .transform((data) => {
    data.isDeleted = data.tab === "Deleted"
    return data
  })

export type TSearchBookEditionsSchema = z.infer<typeof searchBookEditionsSchema>
