import React from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { auth } from "@/queries/auth"
import getBook from "@/queries/books/get-book"
import { format } from "date-fns"
import { Check, X } from "lucide-react"

import { getLocale } from "@/lib/get-locale"
import { getTranslations } from "@/lib/get-translations"
import { EBookEditionStatus, EFeature } from "@/lib/types/enums"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
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
import LocateButton from "@/components/ui/locate-button"
import NoData from "@/components/ui/no-data"
import ParseHtml from "@/components/ui/parse-html"
import Rating from "@/components/ui/rating"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BookEditionStatusBadge from "@/components/badges/book-edition-status-badge"
import ShelfBadge from "@/components/badges/shelf-badge"
import TrainedBadge from "@/components/badges/trained-badge"

import AssignGroupDialog from "./_components/assign-group-dialog"
import AuthorsTabsContent from "./_components/authors-tabs-content"
import BookDetailActionDropdown from "./_components/book-detail-action-dropdown"
import BookDetailBreadCrumb from "./_components/book-detail-breadcrumb"
import CopiesTabsContent from "./_components/copies-tabs-content"
import GroupTabsContent from "./_components/group-tabs-content"
import HistoriesTabsContent from "./_components/histories-tabs-content"
import ResourcesTabsContent from "./_components/resources-tabs-content"

type Props = {
  params: {
    id: string
  }
}

async function BookDetailPage({ params }: Props) {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)

  const t = await getTranslations("BooksManagementPage")
  const locale = await getLocale()

  const book = await getBook(+params.id)

  if (!book) notFound()

  const authors =
    book.authors.length > 0 ? (
      book.authors.map((a) => a.fullName).join(", ")
    ) : (
      <NoData />
    )

  return (
    <div className="mt-4 pb-8">
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

        <Tabs defaultValue="basicInfo">
          <TabsList>
            <TabsTrigger value="basicInfo">{t("Basic info")}</TabsTrigger>
            <TabsTrigger value="editionInfo">{t("Edition info")}</TabsTrigger>
            <TabsTrigger value="classification">
              {t("Classification")}
            </TabsTrigger>
            <TabsTrigger value="physicalDetails">
              {t("Physical details")}
            </TabsTrigger>
            <TabsTrigger value="contentInfo">{t("Content info")}</TabsTrigger>
            <TabsTrigger value="inventoryInfo">
              {t("Inventory info")}
            </TabsTrigger>
            <TabsTrigger value="trainAI">Train AI</TabsTrigger>
            <TabsTrigger value="group-info">{t("Group info")}</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
          <TabsContent value="basicInfo">
            <div className="flex flex-col gap-4 rounded-md border py-5">
              <h3 className="mx-5 text-lg font-semibold">{t("Basic info")}</h3>
              <div className="grid grid-cols-12 gap-y-6 text-sm">
                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("Title")}</h4>
                  <div className="flex gap-2">
                    <Copitor content={book.title.toString()} />
                    <p>{book.title}</p>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                  <h4 className="font-bold">{t("Sub title")}</h4>
                  <div className="flex gap-2">
                    <Copitor content={book.subTitle} />
                    <div>{book.subTitle || <NoData />}</div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("Cover")}</h4>
                  <div className="flex gap-2">
                    {book.coverImage ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            {t("View cover image")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] w-fit overflow-y-auto overflow-x-hidden">
                          <DialogHeader>
                            <DialogTitle className="text-nowrap text-center">
                              {t("Cover image")}
                            </DialogTitle>
                            <DialogDescription>
                              <div className="mt-2 flex justify-center">
                                <Image
                                  src={book.coverImage}
                                  alt={book.title}
                                  width={256}
                                  height={384}
                                  objectFit="cover"
                                  className="aspect-[2/3] h-96 w-64 rounded-md border object-fill"
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

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                  <h4 className="font-bold">{t("avgReviewedRate")}</h4>
                  <div className="flex gap-2">
                    {book.avgReviewedRate ? (
                      <div className="flex items-center gap-2">
                        <div className="text-xl font-medium">
                          {book.avgReviewedRate.toFixed(1)}
                        </div>
                        <div className="font-medium">/ 5</div>
                        <Rating value={book.avgReviewedRate} />
                      </div>
                    ) : (
                      <NoData />
                    )}
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("Authors")}</h4>
                  <div className="flex gap-2">
                    <div>{authors}</div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                  <h4 className="font-bold">{t("Additional authors")}</h4>
                  <div className="flex gap-2">
                    {book.additionalAuthors || <NoData />}
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("Responsibility")}</h4>
                  <div className="flex gap-2">
                    <div>{book.responsibility || <NoData />}</div>
                  </div>
                </div>
                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                  <h4 className="font-bold">{t("Shelf")}</h4>
                  <div className="flex gap-2">
                    <div>
                      {book.shelf ? (
                        <LocateButton
                          shelfId={book.shelf.shelfId}
                          shelfNumber={book.shelf.shelfNumber}
                        >
                          <ShelfBadge shelfNumber={book.shelf.shelfNumber} />
                        </LocateButton>
                      ) : (
                        <NoData />
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("Can borrow")}</h4>
                  <div className="flex gap-2">
                    {book.canBorrow ? (
                      <Check className="text-success" />
                    ) : (
                      <X className="text-danger" />
                    )}
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                  <h4 className="font-bold">{t("Status")}</h4>
                  <div className="flex gap-2">
                    <BookEditionStatusBadge
                      status={
                        book.isDeleted
                          ? EBookEditionStatus.DELETED
                          : book.status
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="editionInfo">
            <div className="flex flex-col gap-4 rounded-md border py-5">
              <h3 className="mx-5 text-lg font-semibold">
                {t("Edition info")}
              </h3>
              <div className="grid grid-cols-12 gap-y-6 text-sm">
                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("Edition")}</h4>
                  <div className="flex gap-2">
                    <div>{book.edition || <NoData />}</div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                  <h4 className="font-bold">{t("Edition number")}</h4>
                  <div className="flex gap-2">
                    <div>{book.editionNumber || <NoData />}</div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("Language")}</h4>
                  <div className="flex gap-2">
                    {book.language || <NoData />}
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                  <h4 className="font-bold">{t("Origin language")}</h4>
                  <div className="flex gap-2">
                    <div>{book.originLanguage || <NoData />}</div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("Publication year")}</h4>
                  <div className="flex gap-2">
                    <div>{book.publicationYear || <NoData />}</div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                  <h4 className="font-bold">{t("Publisher")}</h4>
                  <div className="flex gap-2">
                    <Copitor content={book.publisher} />
                    <div>{book.publisher || <NoData />}</div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                  <h4 className="font-bold">{t("Publication place")}</h4>
                  <div className="flex gap-2">
                    {book.publicationPlace || <NoData />}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="classification">
            <div className="flex flex-col gap-4 rounded-md border py-5">
              <h3 className="mx-5 text-lg font-semibold">
                {t("Classification")}
              </h3>
              <div className="grid grid-cols-12 gap-y-6 text-sm">
                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">ISBN</h4>
                  <div className="flex gap-2">
                    <Copitor content={book.isbn} />
                    <div>{book.isbn || <NoData />}</div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                  <h4 className="font-bold">EAN</h4>
                  <div className="flex gap-2">
                    <Copitor content={book.ean} />
                    <div>{book.ean || <NoData />}</div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("Classification number")}</h4>
                  <div className="flex gap-2">
                    <Copitor content={book.classificationNumber} />
                    <div>{book.classificationNumber || <NoData />}</div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                  <h4 className="font-bold">{t("Cutter number")}</h4>
                  <div className="flex gap-2">
                    <Copitor content={book.cutterNumber} />
                    <div>{book.cutterNumber || <NoData />}</div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                  <h4 className="font-bold">{t("Category")}</h4>
                  <div className="flex gap-2">
                    <Badge variant="draft">
                      {locale === "vi"
                        ? book.category.vietnameseName
                        : book.category.englishName}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="physicalDetails">
            <div className="flex flex-col gap-4 rounded-md border py-5">
              <h3 className="mx-5 text-lg font-semibold">
                {t("Physical details")}
              </h3>
              <div className="grid grid-cols-12 gap-y-6 text-sm">
                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("Physical details")}</h4>
                  <div className="flex gap-2">
                    <div>{book.physicalDetails || <NoData />}</div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                  <h4 className="font-bold">{t("Page count")}</h4>
                  <div className="flex gap-2">
                    <div>{book.pageCount || <NoData />}</div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("Dimensions")}</h4>
                  <div className="flex gap-2">
                    <div>{book.dimensions || <NoData />}</div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                  <h4 className="font-bold">{t("estimatedPrice")}</h4>
                  <div className="flex gap-2">
                    <div>
                      {book.estimatedPrice ? (
                        formatPrice(book.estimatedPrice)
                      ) : (
                        <NoData />
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                  <h4 className="font-bold">{t("Accompanying material")}</h4>
                  <div className="flex gap-2">
                    <div>{book.accompanyingMaterial || <NoData />}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contentInfo">
            <div className="flex flex-col gap-4 rounded-md border py-5">
              <h3 className="mx-5 text-lg font-semibold">
                {t("Content info")}
              </h3>
              <div className="grid grid-cols-12 gap-y-6 text-sm">
                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("Genres")}</h4>
                  <div className="flex gap-2">
                    <div>{book.genres || <NoData />}</div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                  <h4 className="font-bold">{t("Topical terms")}</h4>
                  <div className="flex gap-2">
                    <div>{book.topicalTerms || <NoData />}</div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("General note")}</h4>
                  <div className="flex gap-2">
                    <div>{book.generalNote || <NoData />}</div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                  <h4 className="font-bold">{t("Bibliographical note")}</h4>
                  <div className="flex gap-2">
                    {book.bibliographicalNote || <NoData />}
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                  <h4 className="font-bold">{t("Summary")}</h4>
                  <div className="flex gap-2">
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
                      <NoData />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="inventoryInfo">
            <div className="flex flex-col gap-4 rounded-md border py-5">
              <h3 className="mx-5 text-lg font-semibold">
                {t("Inventory info")}
              </h3>
              <div className="grid grid-cols-12 gap-y-6 text-sm">
                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("Total units")}</h4>
                  <div className="flex gap-2">
                    <div>
                      {book.libraryItemInventory.totalUnits ?? <NoData />}
                    </div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                  <h4 className="font-bold">{t("Available units")}</h4>
                  <div className="flex gap-2">
                    <div>
                      {book.libraryItemInventory.availableUnits ?? <NoData />}
                    </div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("Request units")}</h4>
                  <div className="flex gap-2">
                    <div>
                      {book.libraryItemInventory.requestUnits ?? <NoData />}
                    </div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                  <h4 className="font-bold">{t("Borrowed units")}</h4>
                  <div className="flex gap-2">
                    <div>
                      {book.libraryItemInventory.borrowedUnits ?? <NoData />}
                    </div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("Reserved units")}</h4>
                  <div className="flex gap-2">
                    <div>
                      {book.libraryItemInventory.reservedUnits ?? <NoData />}
                    </div>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                  <h4 className="font-bold">{t("Lost units")}</h4>
                  <div className="flex gap-2">
                    <div>
                      {book.libraryItemInventory.lostUnits ?? <NoData />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trainAI">
            <div className="flex flex-col gap-4 rounded-md border py-5">
              <h3 className="mx-5 text-lg font-semibold">{t("Status")}</h3>
              <div className="grid grid-cols-12 gap-y-6 text-sm">
                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("AI train code")}</h4>
                  <div className="flex gap-2">
                    <Copitor content={book?.libraryItemGroup?.aiTrainingCode} />
                    {book?.libraryItemGroup?.aiTrainingCode || <NoData />}
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                  <h4 className="font-bold">{t("Trained at")}</h4>
                  <div className="flex gap-2">
                    {book.trainedAt ? (
                      format(new Date(book.trainedAt), "dd-MM-yyyy")
                    ) : (
                      <NoData />
                    )}
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("Is trained")}</h4>
                  <div className="flex gap-2">
                    <TrainedBadge trained={book.isTrained} />
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                  <h4 className="font-bold">{t("Details")}</h4>
                  <div className="flex gap-2">
                    {book.aiTrainingSession?.trainingSessionId ? (
                      <Link
                        target="_blank"
                        href={`/management/train-sessions/${book.aiTrainingSession?.trainingSessionId}`}
                        className="text-primary hover:underline"
                      >
                        {t("View details")}
                      </Link>
                    ) : (
                      <NoData />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="group-info">
            <div className="flex flex-col gap-4 rounded-md border py-5">
              <h3 className="mx-5 text-lg font-semibold">{t("Group info")}</h3>
              {book.libraryItemGroup ? (
                <div className="grid grid-cols-12 gap-y-6 text-sm">
                  <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                    <h4 className="font-bold">{t("AI train code")}</h4>
                    <div className="flex gap-2">
                      <Copitor
                        content={book?.libraryItemGroup?.aiTrainingCode}
                      />
                      {book?.libraryItemGroup?.aiTrainingCode || <NoData />}
                    </div>
                  </div>

                  <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                    <h4 className="font-bold">{t("Title")}</h4>
                    <div className="flex gap-2">
                      <Copitor content={book?.libraryItemGroup?.title} />
                      {book?.libraryItemGroup?.title || <NoData />}
                    </div>
                  </div>

                  <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                    <h4 className="font-bold">{t("Sub title")}</h4>
                    <div className="flex gap-2">
                      <Copitor content={book?.libraryItemGroup?.subTitle} />
                      {book?.libraryItemGroup?.subTitle || <NoData />}
                    </div>
                  </div>

                  <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                    <h4 className="font-bold">{t("Author")}</h4>
                    <div className="flex gap-2">
                      <Copitor content={book?.libraryItemGroup?.author} />
                      {book?.libraryItemGroup?.author || <NoData />}
                    </div>
                  </div>
                  <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                    <h4 className="font-bold">{t("Classification number")}</h4>
                    <div className="flex gap-2">
                      <Copitor
                        content={book?.libraryItemGroup?.classificationNumber}
                      />
                      {book?.libraryItemGroup?.classificationNumber || (
                        <NoData />
                      )}
                    </div>
                  </div>

                  <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                    <h4 className="font-bold">{t("Cutter number")}</h4>
                    <div className="flex gap-2">
                      <Copitor content={book?.libraryItemGroup?.cutterNumber} />
                      {book?.libraryItemGroup?.cutterNumber || <NoData />}
                    </div>
                  </div>

                  <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                    <h4 className="font-bold">{t("Created at")}</h4>
                    <div className="flex gap-2">
                      {book.createdAt ? (
                        format(new Date(book.createdAt), "HH:mm dd-MM-yyyy")
                      ) : (
                        <NoData />
                      )}
                    </div>
                  </div>

                  <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                    <h4 className="font-bold">{t("Created by")}</h4>
                    <div className="flex gap-2">
                      <Copitor content={book?.libraryItemGroup?.createdBy} />
                      {book?.libraryItemGroup?.createdBy || <NoData />}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 px-5">
                  <p> {t("No belong to any group yet")}</p>
                  <AssignGroupDialog
                    title={book.title}
                    classificationNumber={book.classificationNumber || ""}
                    cutterNumber={book.cutterNumber || ""}
                    libraryItemId={book.libraryItemId}
                    subTitle={book.subTitle}
                    topicalTerms={book.topicalTerms}
                    author={book.authors.map((a) => a.fullName).join(",")}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="metadata">
            <div className="flex flex-col gap-4 rounded-md border py-5">
              <h3 className="mx-5 text-lg font-semibold">Metadata</h3>
              <div className="grid grid-cols-12 gap-y-6 text-sm">
                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("Created at")}</h4>
                  <div className="flex gap-2">
                    {book.createdAt ? (
                      format(new Date(book.createdAt), "dd-MM-yyyy")
                    ) : (
                      <NoData />
                    )}
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                  <h4 className="font-bold">{t("Created by")}</h4>
                  <div className="flex gap-2">
                    {book.createdBy || <NoData />}
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                  <h4 className="font-bold">{t("Updated at")}</h4>
                  <div className="flex gap-2">
                    {book.updatedAt ? (
                      format(new Date(book.updatedAt), "dd-MM-yyyy")
                    ) : (
                      <NoData />
                    )}
                  </div>
                </div>

                <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                  <h4 className="font-bold">{t("Updated by")}</h4>
                  <div className="flex gap-2">
                    <div>{book.updatedBy || <NoData />}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Tabs defaultValue="authors">
          <TabsList>
            <TabsTrigger value="authors">{t("Authors")}</TabsTrigger>
            <TabsTrigger value="resources">{t("Resources")}</TabsTrigger>
            <TabsTrigger value="copies">{t("Copies")}</TabsTrigger>
            <TabsTrigger value="histories">{t("Histories")}</TabsTrigger>
            <TabsTrigger value="group">{t("Group")}</TabsTrigger>
          </TabsList>
          <AuthorsTabsContent
            authors={book.authors}
            bookId={book.libraryItemId}
          />
          <ResourcesTabsContent
            bookId={book.libraryItemId}
            resources={book.resources}
          />
          <CopiesTabsContent
            prefix={book.category.prefix}
            bookId={book.libraryItemId}
            copies={book.libraryItemInstances}
          />
          <HistoriesTabsContent bookId={book.libraryItemId} />
          <GroupTabsContent bookId={book.libraryItemId} />
        </Tabs>
      </div>
    </div>
  )
}

export default BookDetailPage
