import React from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { auth } from "@/queries/auth"
import getBookEdition from "@/queries/books/get-book-edition"
import { Check, X } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { EBookEditionStatus, EFeature } from "@/lib/types/enums"
import { formatPrice } from "@/lib/utils"
import BookEditionStatusBadge from "@/components/ui/book-edition-status-badge"
import BookFormatBadge from "@/components/ui/book-format-badge"
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
import NoData from "@/components/ui/no-data"
import ParseHtml from "@/components/ui/parse-html"
import ShelfBadge from "@/components/ui/shelf-badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import AuthorsTabsContent from "./_components/authors-tabs-content"
import CopiesTabsContent from "./_components/copies-tabs-content"
import EditionDetailActionDropdown from "./_components/edition-detail-action-dropdown"
import EditionDetailBreadCrumb from "./_components/edition-detail-bread-crumb"

type Props = {
  params: {
    editionId: string
  }
}

async function BookDetailPage({ params }: Props) {
  await auth().protect(EFeature.BOOK_MANAGEMENT)

  const t = await getTranslations("BooksManagementPage")

  const edition = await getBookEdition(+params.editionId)

  if (!edition) notFound()

  return (
    <div className="mt-4 pb-8">
      <div className="flex flex-col gap-4">
        <EditionDetailBreadCrumb
          title={edition.title}
          editionTitle={edition.editionTitle}
          bookId={edition.bookId}
        />

        <div className="flex flex-col gap-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <h3 className="text-2xl font-semibold">{edition.title}</h3>
            <EditionDetailActionDropdown edition={edition} />
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border py-5">
          <h3 className="mx-5 text-lg font-semibold">
            {t("Edition information")}
          </h3>
          <div className="grid grid-cols-12 gap-y-6 text-sm">
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Edition id")}</h4>
              <div className="flex gap-2">
                <Copitor content={edition.bookEditionId.toString()} />
                <p>{edition.bookEditionId}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Book id")}</h4>
              <div className="flex gap-2">
                <Copitor content={edition.bookId.toString()} />
                <p>{edition.bookId}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Title")}</h4>
              <div className="flex gap-2">
                <Copitor content={edition.title.toString()} />
                <p>{edition.title}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Sub title")}</h4>
              <div className="flex gap-2">
                <Copitor content={edition.subTitle} />
                <div>{edition.subTitle || <NoData />}</div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Edition title")}</h4>
              <div className="flex gap-2">
                <Copitor content={edition.editionTitle} />
                <div>{edition.editionTitle || <NoData />}</div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Publisher")}</h4>
              <div className="flex gap-2">
                <div>{edition.publisher || <NoData />}</div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Language")}</h4>
              <div className="flex gap-2">
                <div>{edition.language || <NoData />}</div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">ISBN</h4>
              <div className="flex gap-2">
                <Copitor content={edition.isbn} />
                <div>{edition.isbn || <NoData />}</div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Edition number")}</h4>
              <div className="flex gap-2">
                <p>{edition.editionNumber ?? <NoData />}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Publication year")}</h4>
              <div className="flex gap-2">
                <p>{edition.publicationYear ?? <NoData />}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Page count")}</h4>
              <div className="flex gap-2">
                <p>{edition.pageCount ?? <NoData />}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Estimated price")}</h4>
              <div className="flex gap-2">
                <div>
                  {edition.estimatedPrice ? (
                    formatPrice(edition.estimatedPrice)
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Format")}</h4>
              <div className="flex gap-2">
                {edition.format ? (
                  <BookFormatBadge status={edition.format} />
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Status")}</h4>
              <div className="flex gap-2">
                <BookEditionStatusBadge
                  status={
                    edition.isDeleted
                      ? EBookEditionStatus.DELETED
                      : edition.status
                  }
                />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Can borrow")}</h4>
              <div className="flex gap-2">
                {edition.canBorrow ? (
                  <Check className="text-success" />
                ) : (
                  <X className="text-danger" />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Shelf")}</h4>
              <div className="flex gap-2">
                {edition.shelf?.shelfNumber ? (
                  <ShelfBadge shelfNumber={edition.shelf.shelfNumber} />
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Cover")}</h4>
              <div className="flex gap-2">
                {edition.coverImage ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        {t("View cover image")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] w-fit overflow-y-auto overflow-x-hidden">
                      <DialogHeader>
                        <DialogTitle className="text-nowrap text-center">
                          {t("Cover image")}
                        </DialogTitle>
                        <DialogDescription>
                          <div className="mt-2 flex justify-center">
                            <Image
                              src={edition.coverImage}
                              alt={edition.title}
                              width={256}
                              height={384}
                              objectFit="cover"
                              className="h-96 w-64 rounded-xl border object-cover"
                            />
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Summary book")}</h4>
              <div className="flex gap-2">
                {edition.summary ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        {t("View content")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto overflow-x-hidden">
                      <DialogHeader>
                        <DialogTitle>{t("Summary book")}</DialogTitle>
                        <DialogDescription>
                          <ParseHtml data={edition.summary} />
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
              <h4 className="font-bold">{t("Summary edition")}</h4>
              <div className="flex gap-2">
                {edition.editionSummary ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        {t("View content")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto overflow-x-hidden">
                      <DialogHeader>
                        <DialogTitle>{t("Summary edition")}</DialogTitle>
                        <DialogDescription>
                          <ParseHtml data={edition.editionSummary} />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <NoData />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border py-5">
          <h3 className="mx-5 text-lg font-semibold">
            {t("Copies inventory")}
          </h3>
          <div className="grid grid-cols-12 gap-y-6 text-sm">
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Available copies")}</h4>
              <div className="flex gap-2">
                {edition?.bookEditionInventory?.availableCopies ?? <NoData />}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Request copies")}</h4>
              <div className="flex gap-2">
                {edition?.bookEditionInventory?.requestCopies ?? <NoData />}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Reserved copies")}</h4>
              <div className="flex gap-2">
                {edition?.bookEditionInventory?.reservedCopies ?? <NoData />}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Borrowed copies")}</h4>
              <div className="flex gap-2">
                {edition?.bookEditionInventory?.borrowedCopies ?? <NoData />}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Total copies")}</h4>
              <div className="flex gap-2">
                {edition?.bookEditionInventory?.totalCopies ?? <NoData />}
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="authors">
          <TabsList>
            <TabsTrigger value="authors">{t("Authors")}</TabsTrigger>
            <TabsTrigger value="copies">{t("Copies")}</TabsTrigger>
          </TabsList>
          <AuthorsTabsContent
            authors={edition.authors}
            bookId={edition.bookId}
            editionId={edition.bookEditionId}
          />
          <CopiesTabsContent
            copies={edition.bookEditionCopies}
            bookId={edition.bookId}
            editionId={edition.bookEditionId}
          />
        </Tabs>
      </div>
    </div>
  )
}

export default BookDetailPage
