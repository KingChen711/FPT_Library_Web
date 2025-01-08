import React from "react"
import Image from "next/image"
import Link from "next/link"
import defaultBookCover from "@/public/assets/images/default-book-cover.jpg"
import { auth } from "@/queries/auth"
import getBookEditions from "@/queries/books/get-book-editions"
import { format } from "date-fns"
import { Check, Plus, X } from "lucide-react"
import { getLocale } from "next-intl/server"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EBookEditionStatus, EFeature } from "@/lib/types/enums"
import {
  Column,
  searchBookEditionsSchema,
} from "@/lib/validations/books/search-book-editions"
import BookEditionStatusBadge from "@/components/ui/book-edition-status-badge"
import BookFormatBadge from "@/components/ui/book-format-badge"
import { Button } from "@/components/ui/button"
import NoData from "@/components/ui/no-data"
import Paginator from "@/components/ui/paginator"
import SearchForm from "@/components/ui/search-form"
import SortableTableHead from "@/components/ui/sortable-table-head"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Hidable from "@/components/hoc/hidable"

import BookEditionCheckbox from "./_components/book-edition-checkbox"
import BookEditionActionDropdown from "./_components/book-edition-dropdown"
import ColumnsButton from "./_components/columns-button"
import SelectedIdsIndicator from "./_components/selected-ids-indicator"
import BookEditionsTabs from "./[id]/_components/book-editions-tabs"
import MoveTrashBookEditionsButton from "./[id]/_components/move-trash-book-editions-button"

type Props = {
  searchParams: {
    search?: string
    pageIndex?: string
    pageSize?: string
    sort?: string
    tab?: string
  }
}

async function BooksManagementPage({ searchParams }: Props) {
  const { search, pageIndex, sort, pageSize, tab, columns, ...rest } =
    searchBookEditionsSchema.parse(searchParams)

  await auth().protect(EFeature.BOOK_MANAGEMENT)
  const t = await getTranslations("BooksManagementPage")
  const locale = await getLocale()
  const formatLocale = await getFormatLocale()
  const {
    sources: books,
    totalActualItem,
    totalPage,
  } = await getBookEditions({
    search,
    pageIndex,
    sort,
    pageSize,
    tab,
    columns,
    ...rest,
  })

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Books")}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              // className="h-full rounded-r-none border-r-0"
              search={search}
            />
            {/* <FiltersBooksDialog /> */}
          </div>

          <SelectedIdsIndicator />
        </div>
        <div className="flex flex-wrap items-center gap-x-4">
          <MoveTrashBookEditionsButton tab={tab} />
          <ColumnsButton columns={columns} />
          <Button asChild>
            <Link href="/management/books/create">
              <Plus />
              {t("Create book")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-4 rounded-md border p-4">
        <BookEditionsTabs tab={tab} />
        <div className="mt-4 grid w-full">
          <div className="overflow-x-auto rounded-md">
            <Table className="overflow-hidden">
              <TableHeader className="">
                <TableRow className="">
                  <TableHead></TableHead>
                  <Hidable hide={!columns.includes(Column.BOOK_ID)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Book id")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.BOOK_EDITION_ID)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Edition id")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.BOOK_CODE)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Book code")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.COVER_IMAGE)}>
                    <TableHead>
                      <div className="flex justify-center text-nowrap font-bold">
                        {t("Cover")}
                      </div>
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.TITLE)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Title")}
                      sortKey="Title"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.EDITION_TITLE)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Edition title")}
                      sortKey="EditionTitle"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.EDITION_NUMBER)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Edition number")}
                      sortKey="EditionNumber"
                      position="center"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.PUBLICATION_YEAR)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Publication year")}
                      sortKey="PublicationYear"
                      position="center"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.ISBN)}>
                    <SortableTableHead
                      currentSort={sort}
                      label="ISBN"
                      sortKey="ISBN"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.AUTHOR)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Authors")}
                      sortKey="Author"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.LANGUAGE)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Language")}
                      sortKey="Language"
                      position="center"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.CATEGORIES)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Categories")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.PUBLISHER)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Publisher")}
                      sortKey="Publisher"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.PAGE_COUNT)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Page count")}
                      sortKey="PageCount"
                      position="center"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.SHELF)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Shelf")}
                      sortKey="Shelf"
                      position="center"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.FORMAT)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Format")}
                      sortKey="Format"
                      position="center"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.STATUS)}>
                    <TableHead>
                      <div className="flex justify-center text-nowrap font-bold">
                        {t("Status")}
                      </div>
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.CAN_BORROW)}>
                    <TableHead>
                      <div className="flex justify-center text-nowrap font-bold">
                        {t("Can borrow")}
                      </div>
                    </TableHead>
                  </Hidable>
                  <Hidable hide={!columns.includes(Column.TOTAL_COPIES)}>
                    <TableHead>
                      <div className="flex justify-center text-nowrap font-bold">
                        {t("Total copies")}
                      </div>
                    </TableHead>
                  </Hidable>
                  <Hidable hide={!columns.includes(Column.AVAILABLE_COPIES)}>
                    <TableHead>
                      <div className="flex justify-center text-nowrap font-bold">
                        {t("Available copies")}
                      </div>
                    </TableHead>
                  </Hidable>
                  <Hidable hide={!columns.includes(Column.BORROWED_COPIES)}>
                    <TableHead>
                      <div className="flex justify-center text-nowrap font-bold">
                        {t("Borrowed copies")}
                      </div>
                    </TableHead>
                  </Hidable>
                  <Hidable hide={!columns.includes(Column.REQUEST_COPIES)}>
                    <TableHead>
                      <div className="flex justify-center text-nowrap font-bold">
                        {t("Request copies")}
                      </div>
                    </TableHead>
                  </Hidable>
                  <Hidable hide={!columns.includes(Column.RESERVED_COPIES)}>
                    <TableHead>
                      <div className="flex justify-center text-nowrap font-bold">
                        {t("Reserved copies")}
                      </div>
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.CREATED_BY)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Created by")}
                    </TableHead>
                  </Hidable>
                  <Hidable hide={!columns.includes(Column.CREATED_AT)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Created at")}
                    </TableHead>
                  </Hidable>
                  <Hidable hide={!columns.includes(Column.UPDATED_AT)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Updated by")}
                    </TableHead>
                  </Hidable>

                  <TableHead className="flex select-none items-center justify-center text-nowrap font-bold">
                    {t("Actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length + 2}>
                      <div className="flex justify-center p-4">
                        <NoData />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {books.map((book) => (
                  <TableRow key={book.bookEditionId}>
                    <TableCell className="">
                      <BookEditionCheckbox id={book.bookEditionId} />
                    </TableCell>

                    <Hidable hide={!columns.includes(Column.BOOK_ID)}>
                      <TableCell className="text-nowrap font-bold">
                        <div className="flex justify-center pr-4">
                          {book.bookId || "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.BOOK_EDITION_ID)}>
                      <TableCell className="text-nowrap font-bold">
                        <div className="flex justify-center pr-4">
                          {book.bookEditionId || "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.BOOK_CODE)}>
                      <TableCell className="text-nowrap font-bold">
                        {book.bookCode || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.COVER_IMAGE)}>
                      <TableCell>
                        <div className="flex h-[72px] w-12 shrink-0 justify-center">
                          <Image
                            src={book.coverImage || defaultBookCover}
                            alt={book.title}
                            width={48}
                            height={72}
                            className="h-[72px] w-12 rounded-md border object-cover"
                          />
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.TITLE)}>
                      <TableCell className="text-nowrap">
                        {book.title || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.EDITION_TITLE)}>
                      <TableCell className="text-nowrap">
                        {book.editionTitle || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.EDITION_NUMBER)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center pr-4">
                          {book.editionNumber ?? "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.PUBLICATION_YEAR)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center pr-4">
                          {book.publicationYear ?? "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.ISBN)}>
                      <TableCell className="text-nowrap">
                        {book.isbn || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.AUTHOR)}>
                      <TableCell className="text-nowrap">
                        {book.author || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.LANGUAGE)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center pr-4">
                          {book.language || "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.CATEGORIES)}>
                      <TableCell className="text-nowrap">
                        {book.categories.length > 0
                          ? book.categories
                              .map((c) =>
                                locale === "vi"
                                  ? c.vietnameseName
                                  : c.englishName
                              )
                              .join(", ")
                          : "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.PUBLISHER)}>
                      <TableCell className="text-nowrap">
                        {book.publisher || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.PAGE_COUNT)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center pr-4">
                          {book.pageCount ?? "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.SHELF)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center pr-4">
                          {book.shelf?.shelfNumber || "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.FORMAT)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center pr-4">
                          {book.format ? (
                            <BookFormatBadge status={book.format} />
                          ) : (
                            "-"
                          )}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.STATUS)}>
                      <TableCell>
                        <div className="flex justify-center">
                          <BookEditionStatusBadge
                            status={
                              tab === "Deleted"
                                ? EBookEditionStatus.DELETED
                                : book.status
                            }
                          />
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.CAN_BORROW)}>
                      <TableCell>
                        <div className="flex justify-center">
                          {book.canBorrow ? (
                            <Check className="text-success" />
                          ) : (
                            <X className="text-danger" />
                          )}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.TOTAL_COPIES)}>
                      <TableCell>
                        <div className="flex justify-center text-nowrap">
                          {book.totalCopies ?? "-"}
                        </div>
                      </TableCell>
                    </Hidable>
                    <Hidable hide={!columns.includes(Column.AVAILABLE_COPIES)}>
                      <TableCell>
                        <div className="flex justify-center text-nowrap">
                          {book.availableCopies ?? "-"}
                        </div>
                      </TableCell>
                    </Hidable>
                    <Hidable hide={!columns.includes(Column.BORROWED_COPIES)}>
                      <TableCell>
                        <div className="flex justify-center text-nowrap">
                          {book.borrowedCopies ?? "-"}
                        </div>
                      </TableCell>
                    </Hidable>
                    <Hidable hide={!columns.includes(Column.REQUEST_COPIES)}>
                      <TableCell>
                        <div className="flex justify-center text-nowrap">
                          {book.requestCopies ?? "-"}
                        </div>
                      </TableCell>
                    </Hidable>
                    <Hidable hide={!columns.includes(Column.RESERVED_COPIES)}>
                      <TableCell>
                        <div className="flex justify-center text-nowrap">
                          {book.reservedCopies ?? "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.CREATED_BY)}>
                      <TableCell className="text-nowrap">
                        {book.createBy || "-"}
                      </TableCell>
                    </Hidable>
                    <Hidable hide={!columns.includes(Column.CREATED_AT)}>
                      <TableCell className="text-nowrap">
                        {book.createdAt
                          ? format(new Date(book.createdAt), "yyyy-MM-dd", {
                              locale: formatLocale,
                            })
                          : "-"}
                      </TableCell>
                    </Hidable>
                    <Hidable hide={!columns.includes(Column.UPDATED_AT)}>
                      <TableCell className="text-nowrap">
                        {book.updatedAt
                          ? format(new Date(book.updatedAt), "yyyy-MM-dd", {
                              locale: formatLocale,
                            })
                          : "-"}
                      </TableCell>
                    </Hidable>

                    <TableCell>
                      <div className="flex items-center justify-center">
                        <BookEditionActionDropdown bookEdition={book} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <Paginator
        pageSize={+pageSize}
        pageIndex={pageIndex}
        totalPage={totalPage}
        totalActualItem={totalActualItem}
        className="mt-6"
      />
    </div>
  )
}

export default BooksManagementPage
