import React from "react"
import { notFound } from "next/navigation"
import { auth } from "@/queries/auth"
import getBook from "@/queries/books/get-book"
import { getLocale } from "next-intl/server"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import BookDetailActionDropdown from "./_components/book-detail-action-dropdown"
import BookDetailBreadCrumb from "./_components/book-detail-breadcrumb"
import EditionsTabsContent from "./_components/editions-tabs-content"
import ResourcesTabsContent from "./_components/resources-tabs-content"

type Props = {
  params: {
    id: string
  }
}

async function BookDetailPage({ params }: Props) {
  await auth().protect(EFeature.BOOK_MANAGEMENT)

  const t = await getTranslations("BooksManagementPage")
  const locale = await getLocale()

  const book = await getBook(+params.id)

  if (!book) notFound()

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
                    <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
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
          <ResourcesTabsContent
            resources={book.bookResources}
            bookId={book.bookId}
          />
          <EditionsTabsContent
            editions={book.bookEditions}
            bookId={book.bookId}
          />
        </Tabs>
      </div>
    </div>
  )
}

export default BookDetailPage
