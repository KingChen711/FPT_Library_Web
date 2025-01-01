import React from "react"
import Image from "next/image"
import Link from "next/link"
import defaultBookCover from "@/public/assets/images/default-book-cover.jpg"
import { auth } from "@/queries/auth"
import getBookEditions from "@/queries/books/get-book-editions"
import { format } from "date-fns"
import { Check, Plus, X } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { searchBookEditionsSchema } from "@/lib/validations/books/search-book-editions"
import BookFormatBadge from "@/components/ui/book-format-badge"
import { Button } from "@/components/ui/button"
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

import BookEditionCheckbox from "./_components/book-edition-checkbox"
import BookEditionActionDropdown from "./_components/book-edition-dropdown"
import SelectedIdsIndicator from "./_components/selected-ids-indicator"

type Props = {
  searchParams: {
    search?: string
    pageIndex?: string
    pageSize?: string
    sort?: string
  }
}

async function BooksManagementPage({ searchParams }: Props) {
  const { search, pageIndex, sort, pageSize } =
    searchBookEditionsSchema.parse(searchParams)
  await auth().protect(EFeature.BOOK_MANAGEMENT)
  const t = await getTranslations("BooksManagementPage")
  const {
    sources: books,
    totalActualItem,
    totalPage,
  } = await getBookEditions({ search, pageIndex, sort, pageSize })

  const formatLocale = await getFormatLocale()

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
          {/* <DeleteBookEditionsButton /> */}
          <Button asChild>
            <Link href="/management/books/create">
              <Plus />
              {t("Create book")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-4 grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <Table className="overflow-hidden">
            <TableHeader className="">
              <TableRow className="">
                <TableHead></TableHead>
                <SortableTableHead
                  currentSort={sort}
                  label={t("Book id")}
                  sortKey="BookId"
                  position="center"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("Edition id")}
                  sortKey="BookEditionId"
                  position="center"
                />
                <TableHead>
                  <div className="flex justify-center text-nowrap font-bold">
                    {t("Cover")}
                  </div>
                </TableHead>
                <SortableTableHead
                  currentSort={sort}
                  label={t("Title")}
                  sortKey="Title"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("Edition title")}
                  sortKey="Edition title"
                />
                <SortableTableHead
                  currentSort={sort}
                  label="ISBN"
                  sortKey="isbn"
                />
                <TableHead>
                  <div className="flex justify-center text-nowrap font-bold">
                    {t("Can borrow")}
                  </div>
                </TableHead>

                <SortableTableHead
                  currentSort={sort}
                  label={t("Authors")}
                  sortKey="Author"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("Edition number")}
                  sortKey="EditionNumber"
                  position="center"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("Publication year")}
                  sortKey="PublicationYear"
                  position="center"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("Page count")}
                  sortKey="PageCount"
                  position="center"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("Total copies")}
                  sortKey="TotalCopies"
                  position="center"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("Available copies")}
                  sortKey="AvailableCopies"
                  position="center"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("Request copies")}
                  sortKey="RequestCopies"
                  position="center"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("Reserved copies")}
                  sortKey="ReservedCopies"
                  position="center"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("Language")}
                  sortKey="Language"
                  position="center"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("Shelf")}
                  sortKey="Shelf"
                  position="center"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("Format")}
                  sortKey="Format"
                  position="center"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("Publisher")}
                  sortKey="Publisher"
                />

                <TableHead className="flex select-none items-center justify-center text-nowrap font-bold">
                  {t("Actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.bookEditionId}>
                  <TableCell className="">
                    <BookEditionCheckbox id={book.bookEditionId} />
                  </TableCell>
                  <TableCell className="font-bold">
                    <div className="flex justify-center pr-4">
                      {book.bookId || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    <div className="flex justify-center pr-4">
                      {book.bookEditionId || "-"}
                    </div>
                  </TableCell>
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

                  <TableCell className="text-nowrap">
                    {book.title || "-"}
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {book.editionTitle || "-"}
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {book.isbn || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      {book.canBorrow ? (
                        <Check className="text-success" />
                      ) : (
                        <X className="text-danger" />
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {book.author || "-"}
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center pr-4">
                      {book.editionNumber ?? "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center pr-4">
                      {book.publicationYear ?? "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center pr-4">
                      {book.pageCount ?? "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center pr-4">
                      {book.totalCopies ?? "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center pr-4">
                      {book.availableCopies ?? "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center pr-4">
                      {book.requestCopies ?? "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center pr-4">
                      {book.reservedCopies ?? "-"}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center pr-4">
                      {book.language || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center pr-4">
                      {book.shelf || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center pr-4">
                      {book.format ? (
                        <BookFormatBadge status={book.format} />
                      ) : (
                        "-"
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {book.publisher || "-"}
                  </TableCell>

                  <TableCell className="flex justify-center">
                    <BookEditionActionDropdown bookEdition={book} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
