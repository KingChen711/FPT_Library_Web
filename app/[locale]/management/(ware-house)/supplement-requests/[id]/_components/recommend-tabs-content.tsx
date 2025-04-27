/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import NoImage from "@/public/assets/images/no-image.png"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { type TSearchAIRecommendsSchema } from "@/lib/validations/trackings/search-ai-recommend"
import useAIRecommends from "@/hooks/trackings/use-ai-recommends"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Paginator from "@/components/ui/paginator"
import ParseHtml from "@/components/ui/parse-html"
import Rating from "@/components/ui/rating"
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
import { TabsContent } from "@/components/ui/tabs"

import FiltersRecommendsDialog from "./filters-recommend-dialog"

const initSearchParams: TSearchAIRecommendsSchema = {
  pageIndex: 1,
  pageSize: "5",
  search: "",
  averageRatingRange: [null, null],
  pageCountRange: [null, null],
  ratingsCountRange: [null, null],
}

type Props = {
  trackingId: number
}

function RecommendTabsContent({ trackingId }: Props) {
  const t = useTranslations("TrackingsManagementPage")
  const [searchParams, setSearchParams] =
    useState<TSearchAIRecommendsSchema>(initSearchParams)

  const { data } = useAIRecommends(trackingId, searchParams)

  if (!data) {
    return (
      <TabsContent value="tracking-details">
        <Loader2 className="size-9 animate-spin" />
      </TabsContent>
    )
  }

  const handleSort = (sortKey: any) =>
    setSearchParams((prev) => ({
      ...prev,
      sort: sortKey,
      pageIndex: 1,
    }))

  const handleSearch = (val: string) => {
    setSearchParams((prev) => ({
      ...prev,
      search: val,
      pageIndex: 1,
    }))
  }

  return (
    <TabsContent value="recommended">
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold">{t("Recommended by AI")}</h3>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-row items-center">
              <SearchForm
                className="h-full rounded-r-none border-r-0"
                search={searchParams.search}
                onSearch={handleSearch}
              />
              <FiltersRecommendsDialog
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
            </div>
          </div>
        </div>

        {data?.sources.length > 0 ? (
          <div className="grid w-full">
            <div className="overflow-x-auto rounded-md border">
              <Table className="overflow-hidden">
                <TableHeader>
                  <TableRow>
                    <SortableTableHead
                      currentSort={searchParams.sort}
                      label={t("Title")}
                      sortKey="Title"
                      onSort={handleSort}
                    />

                    <SortableTableHead
                      currentSort={searchParams.sort}
                      label={t("Authors")}
                      sortKey="Author"
                      onSort={handleSort}
                    />

                    <SortableTableHead
                      currentSort={searchParams.sort}
                      label={t("Publisher")}
                      sortKey="Publisher"
                      onSort={handleSort}
                    />

                    <SortableTableHead
                      currentSort={searchParams.sort}
                      label={t("Published date")}
                      sortKey="PublishedDate"
                      onSort={handleSort}
                      position="center"
                    />

                    <SortableTableHead
                      currentSort={searchParams.sort}
                      label="ISBN"
                      sortKey="ISBN"
                      onSort={handleSort}
                      position="center"
                    />

                    <SortableTableHead
                      currentSort={searchParams.sort}
                      label={t("Page count")}
                      sortKey="PageCount"
                      onSort={handleSort}
                      position="center"
                    />

                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Dimension")}
                      </div>
                    </TableHead>

                    <SortableTableHead
                      currentSort={searchParams.sort}
                      label={t("Estimated price")}
                      sortKey="EstimatedPrice"
                      onSort={handleSort}
                      position="center"
                    />

                    <SortableTableHead
                      currentSort={searchParams.sort}
                      label={t("Language")}
                      sortKey="Language"
                      onSort={handleSort}
                      position="center"
                    />

                    <SortableTableHead
                      currentSort={searchParams.sort}
                      label={t("Categories")}
                      sortKey="Categories"
                      onSort={handleSort}
                      position="center"
                    />

                    <SortableTableHead
                      currentSort={searchParams.sort}
                      label={t("Average rating")}
                      sortKey="AverageRating"
                      onSort={handleSort}
                      position="center"
                    />

                    <SortableTableHead
                      currentSort={searchParams.sort}
                      label={t("Ratings count")}
                      sortKey="RatingsCount"
                      onSort={handleSort}
                      position="center"
                    />

                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Description")}
                      </div>
                    </TableHead>

                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Preview link")}
                      </div>
                    </TableHead>

                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Info link")}
                      </div>
                    </TableHead>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Supplement request reason")}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.sources?.map((field) => (
                    <TableRow key={field.supplementRequestDetailId}>
                      <TableCell className="cursor-not-allowed text-nowrap font-bold text-muted-foreground">
                        <div className="flex items-center gap-2 pr-8">
                          {field.coverImageLink ? (
                            <Image
                              alt={field.title}
                              src={field.coverImageLink}
                              width={40}
                              height={60}
                              className="aspect-[2/3] h-12 w-8 rounded-sm border object-cover"
                            />
                          ) : (
                            <Image
                              alt={field.title}
                              src={NoImage}
                              width={40}
                              height={60}
                              className="aspect-[2/3] h-12 w-8 rounded-sm border object-cover"
                            />
                          )}
                          <p className="font-bold">{field.title || "-"}</p>
                        </div>
                      </TableCell>

                      <TableCell className="cursor-not-allowed text-nowrap text-muted-foreground">
                        {field.author || "-"}
                      </TableCell>

                      <TableCell className="cursor-not-allowed text-nowrap text-muted-foreground">
                        {field.publisher || "-"}
                      </TableCell>

                      <TableCell className="cursor-not-allowed text-nowrap text-muted-foreground">
                        <div className="flex justify-center">
                          {field.publishedDate || "-"}
                        </div>
                      </TableCell>

                      <TableCell className="cursor-not-allowed text-nowrap text-muted-foreground">
                        <div className="flex justify-center">
                          {field.isbn || "-"}
                        </div>
                      </TableCell>

                      <TableCell className="cursor-not-allowed text-nowrap text-muted-foreground">
                        <div className="flex justify-center">
                          {field.pageCount ?? "-"}
                        </div>
                      </TableCell>

                      <TableCell className="cursor-not-allowed text-nowrap text-muted-foreground">
                        <div className="flex cursor-not-allowed justify-center text-muted-foreground">
                          {field.dimensions || "-"}
                        </div>
                      </TableCell>

                      <TableCell className="text-nowrap">
                        <div className="flex cursor-not-allowed justify-center text-muted-foreground">
                          {field.estimatedPrice || "-"}
                        </div>
                      </TableCell>

                      <TableCell className="text-nowrap">
                        <div className="flex cursor-not-allowed justify-center text-muted-foreground">
                          {field.language || "-"}
                        </div>
                      </TableCell>

                      <TableCell className="text-nowrap">
                        <div className="flex cursor-not-allowed justify-center text-muted-foreground">
                          {field.categories || "-"}
                        </div>
                      </TableCell>

                      <TableCell className="text-nowrap">
                        <div className="flex justify-center text-muted-foreground">
                          <Rating value={field.averageRating} />
                        </div>
                      </TableCell>

                      <TableCell className="cursor-not-allowed text-nowrap text-muted-foreground">
                        <div className="flex justify-center">
                          {field.ratingsCount ?? "-"}
                        </div>
                      </TableCell>

                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {field.description ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  {t("View content")}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto overflow-x-hidden">
                                <DialogHeader>
                                  <DialogTitle>{t("Description")}</DialogTitle>
                                  <DialogDescription>
                                    <ParseHtml data={field.description} />
                                  </DialogDescription>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            "-"
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {field.previewLink ? (
                            <Button asChild variant="link">
                              <Link target="_blank" href={field.previewLink}>
                                {t("Open link")}
                              </Link>
                            </Button>
                          ) : (
                            "-"
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {field.infoLink ? (
                            <Button asChild variant="link">
                              <Link target="_blank" href={field.infoLink}>
                                {t("Open link")}
                              </Link>
                            </Button>
                          ) : (
                            "-"
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-center">
                          {field.supplementRequestReason ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  {t("View content")}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto overflow-x-hidden">
                                <DialogHeader>
                                  <DialogTitle>
                                    {t("Supplement request reason")}
                                  </DialogTitle>
                                  <DialogDescription>
                                    <ParseHtml
                                      data={field.supplementRequestReason}
                                    />
                                  </DialogDescription>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            "-"
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {t("No selected items")}
          </div>
        )}

        {data?.sources.length > 0 && (
          <Paginator
            pageSize={+data?.pageSize}
            pageIndex={data?.pageIndex}
            totalPage={data?.totalPage}
            totalActualItem={data?.totalActualItem}
            className="mt-6"
            onPaginate={(page) =>
              setSearchParams((prev) => ({
                ...prev,
                pageIndex: page,
              }))
            }
            onChangePageSize={(size) =>
              setSearchParams((prev) => ({
                ...prev,
                pageSize: size,
              }))
            }
          />
        )}
      </div>
    </TabsContent>
  )
}

export default RecommendTabsContent
