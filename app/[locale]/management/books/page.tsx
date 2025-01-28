import React from "react"
import Image from "next/image"
import Link from "next/link"
import defaultBookCover from "@/public/assets/images/default-book-cover.jpg"
import { auth } from "@/queries/auth"
import getBookEditions from "@/queries/books/get-book-editions"
import { format } from "date-fns"
import { Check, Plus, X } from "lucide-react"
import { getLocale } from "next-intl/server"

import { getTranslations } from "@/lib/get-translations"
import { EBookEditionStatus, EFeature } from "@/lib/types/enums"
import { formatPrice } from "@/lib/utils"
import {
  Column,
  searchBookEditionsSchema,
} from "@/lib/validations/books/search-book-editions"
import BookEditionStatusBadge from "@/components/ui/book-edition-status-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import NoData from "@/components/ui/no-data"
import Paginator from "@/components/ui/paginator"
import ParseHtml from "@/components/ui/parse-html"
import Rating from "@/components/ui/rating"
import SearchForm from "@/components/ui/search-form"
import ShelfBadge from "@/components/ui/shelf-badge"
import SortableTableHead from "@/components/ui/sortable-table-head"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import TrainedBadge from "@/components/ui/trained-badge"
import Hidable from "@/components/hoc/hidable"

import BookEditionCheckbox from "./_components/book-edition-checkbox"
// import BookEditionActionDropdown from "./_components/book-edition-dropdown"
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

                  <Hidable hide={!columns.includes(Column.SUBTITLE)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Sub title")}
                      sortKey="SubTitle"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.AUTHORS)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Authors")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.ADDITIONAL_AUTHORS)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Additional authors")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.RESPONSIBILITY)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Responsibility")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.EDITION)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Edition")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.EDITION_NUMBER)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Edition number")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.LANGUAGE)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Language")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.ORIGIN_LANGUAGE)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Original language")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.PUBLICATION_YEAR)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Publication year")}
                      sortKey="PublicationYear"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.PUBLISHER)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Publisher")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.PUBLICATION_PLACE)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Publication place")}
                    </TableHead>
                  </Hidable>

                  <Hidable
                    hide={!columns.includes(Column.CLASSIFICATION_NUMBER)}
                  >
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Classification number")}
                      sortKey="ClassificationNumber"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.CUTTER_NUMBER)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Cutter number")}
                      sortKey="CutterNumber"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.SHELF)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Shelf")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.CATEGORY)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Category")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.ISBN)}>
                    <TableHead className="text-nowrap font-bold">
                      ISBN
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.EAN)}>
                    <TableHead className="text-nowrap font-bold">EAN</TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.PAGE_COUNT)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Page count")}
                      sortKey="PageCount"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.PHYSICAL_DETAILS)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Physical details")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.DIMENSIONS)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Dimensions")}
                    </TableHead>
                  </Hidable>

                  <Hidable
                    hide={!columns.includes(Column.ACCOMPANYING_MATERIAL)}
                  >
                    <TableHead className="text-nowrap font-bold">
                      {t("Accompanying material")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.ESTIMATED_PRICE)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Estimated price")}
                      sortKey="EstimatedPrice"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.SUMMARY)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Summary")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.GENRES)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Genres")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.TOPICAL_TERMS)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Topical terms")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.GENERAL_NOTE)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("General note")}
                    </TableHead>
                  </Hidable>

                  <Hidable
                    hide={!columns.includes(Column.BIBLIOGRAPHICAL_NOTE)}
                  >
                    <TableHead className="text-nowrap font-bold">
                      {t("Bibliographical note")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.STATUS)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Status")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.CAN_BORROW)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Can borrow")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.IS_TRAINED)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Is trained")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.TRAINED_AT)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Trained at")}
                      sortKey="TrainedAt"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.AVG_REVIEWED_RATE)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Avg reviewed rate")}
                      sortKey="AvgReviewedRate"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.CREATED_AT)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Created at")}
                      sortKey="CreatedAt"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.CREATED_BY)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Created by")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.UPDATED_AT)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Updated at")}
                      sortKey="UpdatedAt"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.UPDATED_BY)}>
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
                  <TableRow key={book.libraryItemId}>
                    <TableCell className="">
                      <BookEditionCheckbox id={book.libraryItemId} />
                    </TableCell>

                    <Hidable hide={!columns.includes(Column.COVER_IMAGE)}>
                      <TableCell>
                        <div className="flex shrink-0 justify-center">
                          <div className="h-[72px] w-12 shrink-0">
                            <Image
                              src={book.coverImage || defaultBookCover}
                              alt={book.title}
                              width={48}
                              height={72}
                              className="h-[72px] w-12 rounded-md border object-cover"
                            />
                          </div>
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.TITLE)}>
                      <TableCell className="text-nowrap">
                        {book.title}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.SUBTITLE)}>
                      <TableCell className="text-nowrap">
                        {book.subTitle || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.AUTHORS)}>
                      <TableCell className="text-nowrap">
                        {book?.libraryItemAuthors?.length > 0
                          ? book.libraryItemAuthors
                              ?.map((val) => val.author.fullName)
                              .join(", ")
                          : "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable
                      hide={!columns.includes(Column.ADDITIONAL_AUTHORS)}
                    >
                      <TableCell className="text-nowrap">
                        {book.additionalAuthors || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.RESPONSIBILITY)}>
                      <TableCell className="text-nowrap">
                        {book.responsibility || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.EDITION)}>
                      <TableCell className="text-nowrap">
                        {book.edition || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.EDITION_NUMBER)}>
                      <TableCell className="text-nowrap">
                        {book.editionNumber || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.LANGUAGE)}>
                      <TableCell className="text-nowrap">
                        {book.language || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.ORIGIN_LANGUAGE)}>
                      <TableCell className="text-nowrap">
                        {book.originLanguage || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.PUBLICATION_YEAR)}>
                      <TableCell className="text-nowrap">
                        {book.publicationYear || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.PUBLISHER)}>
                      <TableCell className="text-nowrap">
                        {book.publisher || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.PUBLICATION_PLACE)}>
                      <TableCell className="text-nowrap">
                        {book.publicationPlace || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable
                      hide={!columns.includes(Column.CLASSIFICATION_NUMBER)}
                    >
                      <TableCell className="text-nowrap">
                        {book.classificationNumber || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.CUTTER_NUMBER)}>
                      <TableCell className="text-nowrap">
                        {book.cutterNumber || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.SHELF)}>
                      <TableCell className="text-nowrap">
                        {book.shelf?.shelfNumber ? (
                          <ShelfBadge shelfNumber={book.shelf?.shelfNumber} />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.CATEGORY)}>
                      <TableCell className="text-nowrap">
                        {locale === "vi"
                          ? book.category.vietnameseName
                          : book.category.englishName}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.ISBN)}>
                      <TableCell className="text-nowrap">
                        {book.isbn || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.EAN)}>
                      <TableCell className="text-nowrap">
                        {book.ean || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.PAGE_COUNT)}>
                      <TableCell className="text-nowrap">
                        {book.pageCount || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.PHYSICAL_DETAILS)}>
                      <TableCell className="text-nowrap">
                        {book.physicalDetails || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.DIMENSIONS)}>
                      <TableCell className="text-nowrap">
                        {book.dimensions || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable
                      hide={!columns.includes(Column.ACCOMPANYING_MATERIAL)}
                    >
                      <TableCell className="text-nowrap">
                        {book.accompanyingMaterial || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.ESTIMATED_PRICE)}>
                      <TableCell className="text-nowrap">
                        {book.estimatedPrice
                          ? formatPrice(book.estimatedPrice)
                          : "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.SUMMARY)}>
                      <TableCell className="text-nowrap">
                        {book.summary ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                {t("View content")}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
                              <DialogHeader>
                                <DialogTitle>{t("Summary")}</DialogTitle>
                                <DialogDescription>
                                  <ParseHtml data={book.summary} />
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.GENRES)}>
                      <TableCell className="text-nowrap">
                        {book.genres || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.TOPICAL_TERMS)}>
                      <TableCell className="text-nowrap">
                        {book.topicalTerms || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.GENERAL_NOTE)}>
                      <TableCell className="text-nowrap">
                        {book.generalNote || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable
                      hide={!columns.includes(Column.BIBLIOGRAPHICAL_NOTE)}
                    >
                      <TableCell className="text-nowrap">
                        {book.bibliographicalNote || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.STATUS)}>
                      <TableCell className="text-nowrap">
                        <BookEditionStatusBadge
                          status={
                            book.isDeleted
                              ? EBookEditionStatus.DELETED
                              : book.status
                          }
                        />
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.CAN_BORROW)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {book.canBorrow ? (
                            <Check className="text-success" />
                          ) : (
                            <X className="text-danger" />
                          )}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.IS_TRAINED)}>
                      <TableCell className="text-nowrap">
                        <TrainedBadge trained={book.isTrained} />
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.TRAINED_AT)}>
                      <TableCell className="text-nowrap">
                        {book.trainedAt
                          ? format(new Date(book.trainedAt), "dd-MM-yyyy")
                          : "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.AVG_REVIEWED_RATE)}>
                      <TableCell className="text-nowrap">
                        {book.avgReviewedRate ? (
                          <div className="flex items-center gap-2">
                            <div className="text-xl font-medium">
                              {book.avgReviewedRate.toFixed(1)}
                            </div>
                            <div className="font-medium">/ 5</div>
                            <Rating value={book.avgReviewedRate} />
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.CREATED_AT)}>
                      <TableCell className="text-nowrap">
                        {book.createdAt
                          ? format(new Date(book.createdAt), "dd-MM-yyyy")
                          : "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.CREATED_BY)}>
                      <TableCell className="text-nowrap">
                        {book.createdBy || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.UPDATED_AT)}>
                      <TableCell className="text-nowrap">
                        {book.updatedAt
                          ? format(new Date(book.updatedAt), "dd-MM-yyyy")
                          : "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.UPDATED_BY)}>
                      <TableCell className="text-nowrap">
                        {book.updatedBy || "-"}
                      </TableCell>
                    </Hidable>

                    <TableCell>
                      <div className="flex items-center justify-center">
                        {/* <BookEditionActionDropdown bookEdition={book} /> */}
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
