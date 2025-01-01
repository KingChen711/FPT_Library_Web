import React from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Link } from "@/i18n/routing"
import defaultBookCover from "@/public/assets/images/default-book-cover.jpg"
import { auth } from "@/queries/auth"
import getBook from "@/queries/books/get-book"
import { format } from "date-fns"
import { Check, X } from "lucide-react"
import { getLocale } from "next-intl/server"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import BookFormatBadge from "@/components/ui/book-format-badge"
import ResourceBookTypeBadge from "@/components/ui/book-resource-type-badge"
import { Button } from "@/components/ui/button"
import Copitor from "@/components/ui/copitor"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import FileSize from "@/components/ui/file-size"
import { Icons } from "@/components/ui/icons"
import NoData from "@/components/ui/no-data"
import ParseHtml from "@/components/ui/parse-html"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import BookEditionActionDropdown from "../_components/book-edition-dropdown"
import BookDetailActionDropdown from "./_components/book-detail-action-dropdown"
import BookDetailBreadCrumb from "./_components/book-detail-breadcrumb"

type Props = {
  params: {
    id: string
  }
}

async function BookDetailPage({ params }: Props) {
  await auth().protect(EFeature.BOOK_MANAGEMENT)

  const t = await getTranslations("BooksManagementPage")
  const locale = await getLocale()
  const formatLocale = await getFormatLocale()

  const book = await getBook(+params.id)

  if (!book) notFound()

  return (
    <div className="mt-4">
      <div className="flex flex-col gap-4">
        <BookDetailBreadCrumb title={book.title} />

        <div className="flex flex-col gap-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <h3 className="text-2xl font-semibold">{book.title}</h3>
            <BookDetailActionDropdown book={book} />
          </div>
          {book.subTitle && (
            <p className="text-sm text-muted-foreground">{book.subTitle}</p>
          )}
        </div>

        <div className="flex flex-col gap-4 rounded-md border py-5">
          <h3 className="mx-5 text-lg font-semibold">
            {t("Book information")}
          </h3>
          <div className="grid grid-cols-12 gap-y-6 text-sm">
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Book id")}</h4>
              <div className="flex gap-2">
                <Copitor content={book.bookId.toString()} />
                <p>{book.bookId}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Title")}</h4>
              <div className="flex gap-2">
                <Copitor content={book.title.toString()} />
                <p>{book.title}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Sub title")}</h4>
              <div className="flex gap-2">
                <Copitor content={book.subTitle} />
                <div>{book.subTitle || <NoData />}</div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("AI train code")}</h4>
              <div className="flex gap-2">
                <Copitor content={book.bookCodeForAITraining} />
                <div>{book.bookCodeForAITraining || <NoData />}</div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Summary")}</h4>
              <div className="flex gap-2">
                {book.summary ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        {t("View content")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto overflow-x-hidden">
                      <DialogHeader>
                        <DialogTitle>{t("Summary content")}</DialogTitle>
                        <DialogDescription>
                          <ParseHtml data={book.summary} />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Categories")}</h4>
              <div className="flex gap-2">
                <div>
                  {book.categories
                    .map((c) =>
                      locale === "vi" ? c.vietnameseName : c.englishName
                    )
                    .join(", ")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="resources">
          <TabsList>
            <TabsTrigger value="resources">{t("Book resources")}</TabsTrigger>
            <TabsTrigger value="editions">{t("Book editions")}</TabsTrigger>
          </TabsList>
          <TabsContent value="resources">
            <div className="mt-4 grid w-full">
              <div className="overflow-x-auto rounded-md border">
                <Table className="overflow-hidden">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-nowrap font-bold">
                        Id
                      </TableHead>
                      <TableHead className="text-nowrap font-bold">
                        {t("Title")}
                      </TableHead>
                      <TableHead className="text-nowrap font-bold">
                        {t("Resource type")}
                      </TableHead>
                      <TableHead className="text-nowrap font-bold">
                        {t("Size")}
                      </TableHead>
                      <TableHead className="text-nowrap font-bold">
                        {t("Created at")}
                      </TableHead>
                      <TableHead className="text-nowrap font-bold">
                        {t("Created by")}
                      </TableHead>
                      <TableHead className="text-nowrap font-bold">
                        {t("Actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {book.bookResources.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <div className="flex justify-center p-4">
                            <NoData />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    {book.bookResources.map((resource) => (
                      <TableRow key={resource.resourceId}>
                        <TableCell className="font-extrabold">
                          {resource.resourceId}
                        </TableCell>
                        <TableCell className="text-nowrap">Sách nói</TableCell>
                        <TableCell>
                          <ResourceBookTypeBadge
                            status={resource.resourceType}
                          />
                        </TableCell>
                        <TableCell className="text-nowrap">
                          <FileSize size={resource.resourceSize} />
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {format(new Date(resource.createdAt), "yyyy-MM-dd")}
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {resource.createdBy}
                        </TableCell>
                        <TableCell className="text-nowrap">
                          <Link
                            href={resource.resourceUrl}
                            target="_blank"
                            className="flex items-center text-primary"
                          >
                            <Icons.Open className="size-6" />
                            {t("Open")}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="editions">
            <div className="mt-4 grid w-full">
              <div className="overflow-x-auto rounded-md border">
                <Table className="overflow-hidden">
                  <TableHeader className="">
                    <TableRow className="">
                      <TableHead className="text-nowrap font-bold">
                        <div className="flex justify-center">
                          {t("Book id")}
                        </div>
                      </TableHead>
                      <TableHead className="text-nowrap font-bold">
                        <div className="flex justify-center">
                          {t("Edition id")}
                        </div>
                      </TableHead>

                      <TableHead>
                        <div className="flex justify-center text-nowrap font-bold">
                          {t("Cover")}
                        </div>
                      </TableHead>
                      <TableHead className="text-nowrap font-bold">
                        {t("Title")}
                      </TableHead>
                      <TableHead className="text-nowrap font-bold">
                        {t("Edition title")}
                      </TableHead>
                      <TableHead className="text-nowrap font-bold">
                        ISBN
                      </TableHead>

                      <TableHead>
                        <div className="flex justify-center text-nowrap font-bold">
                          {t("Can borrow")}
                        </div>
                      </TableHead>

                      <TableHead className="text-nowrap font-bold">
                        {t("Authors")}
                      </TableHead>

                      <TableHead>
                        <div className="flex justify-center text-nowrap font-bold">
                          {t("Edition number")}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex justify-center text-nowrap font-bold">
                          {t("Publication year")}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex justify-center text-nowrap font-bold">
                          {t("Page count")}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex justify-center text-nowrap font-bold">
                          {t("Total copies")}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex justify-center text-nowrap font-bold">
                          {t("Available copies")}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex justify-center text-nowrap font-bold">
                          {t("Request copies")}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex justify-center text-nowrap font-bold">
                          {t("Reserved copies")}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex justify-center text-nowrap font-bold">
                          {t("Language")}
                        </div>
                      </TableHead>

                      <TableHead>
                        <div className="flex justify-center text-nowrap font-bold">
                          {t("Shelf")}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex justify-center text-nowrap font-bold">
                          {t("Format")}
                        </div>
                      </TableHead>
                      <TableHead className="text-nowrap font-bold">
                        {t("Publisher")}
                      </TableHead>
                      <TableHead className="text-nowrap font-bold">
                        <div className="flex justify-center">
                          {t("Actions")}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {book.bookEditions.map((edition) => (
                      <TableRow key={edition.bookEditionId}>
                        <TableCell className="font-bold">
                          <div className="flex justify-center pr-4">
                            {edition.bookId || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold">
                          <div className="flex justify-center pr-4">
                            {edition.bookEditionId || "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex h-[72px] w-12 shrink-0 justify-center">
                            <Image
                              src={edition.coverImage || defaultBookCover}
                              alt={edition.title}
                              width={48}
                              height={72}
                              className="h-[72px] w-12 rounded-md border object-cover"
                            />
                          </div>
                        </TableCell>

                        <TableCell className="text-nowrap">
                          {edition.title || "-"}
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {edition.editionTitle || "-"}
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {edition.isbn || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            {edition.canBorrow ? (
                              <Check className="text-success" />
                            ) : (
                              <X className="text-danger" />
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-nowrap">
                          {edition.authors?.map((a) => a.fullName).join(", ") ||
                            "-"}
                        </TableCell>
                        <TableCell className="text-nowrap">
                          <div className="flex justify-center pr-4">
                            {edition.editionNumber ?? "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-nowrap">
                          <div className="flex justify-center pr-4">
                            {edition.publicationYear ?? "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-nowrap">
                          <div className="flex justify-center pr-4">
                            {edition.pageCount ?? "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-nowrap">
                          <div className="flex justify-center pr-4">
                            {edition.bookEditionInventory?.totalCopies ?? "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-nowrap">
                          <div className="flex justify-center pr-4">
                            {edition.bookEditionInventory?.availableCopies ??
                              "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-nowrap">
                          <div className="flex justify-center pr-4">
                            {edition.bookEditionInventory?.requestCopies ?? "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-nowrap">
                          <div className="flex justify-center pr-4">
                            {edition.bookEditionInventory?.reservedCopies ??
                              "-"}
                          </div>
                        </TableCell>

                        <TableCell className="text-nowrap">
                          <div className="flex justify-center pr-4">
                            {edition.language || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-nowrap">
                          <div className="flex justify-center pr-4">
                            {edition.shelf || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-nowrap">
                          <div className="flex justify-center pr-4">
                            {edition.format ? (
                              <BookFormatBadge status={edition.format} />
                            ) : (
                              "-"
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {edition.publisher || "-"}
                        </TableCell>
                        <TableCell className="text-nowrap">
                          <div className="flex justify-center">
                            <BookEditionActionDropdown
                              hideViewBookDetail
                              bookEdition={edition}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default BookDetailPage
