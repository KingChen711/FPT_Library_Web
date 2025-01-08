"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import defaultBookCover from "@/public/assets/images/default-book-cover.jpg"
import { type BookEditions } from "@/queries/books/get-book"
import { Check, CheckSquare, Search, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import BookEditionStatusBadge from "@/components/ui/book-edition-status-badge"
import BookFormatBadge from "@/components/ui/book-format-badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import ShelfBadge from "@/components/ui/shelf-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"

import BookEditionActionDropdown from "../../../_components/book-edition-dropdown"
import CreateEditionDialog from "./create-edition-dialog"
import EditionsActionsDropdown from "./editions-actions-dropdown"
import EditionsTabs from "./editions-tabs"

type Props = {
  editions: BookEditions
  bookId: number
}

function EditionsTabsContent({ editions, bookId }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEditionIds, setSelectedEditionIds] = useState<number[]>([])
  const [tab, setTab] = useState<"Active" | "Deleted">("Active")

  const filteredEditions = editions.filter(
    (edition) => edition.isDeleted === (tab === "Deleted")
  )

  useEffect(() => {
    setSelectedEditionIds([])
  }, [tab])

  return (
    <TabsContent value="editions">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div
            className={cn(
              "flex max-w-md flex-1 items-center rounded-lg border-2 px-2"
            )}
          >
            <Search className="size-6" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
              placeholder={locale === "vi" ? "Tìm kiếm..." : "Search..."}
            />
          </div>
          {selectedEditionIds.length > 0 && (
            <div className="flex h-10 items-center justify-center gap-x-2 rounded-md bg-primary px-2 py-1 text-sm text-primary-foreground">
              <CheckSquare className="size-4" />
              {t("editions selected", {
                amount: selectedEditionIds.length.toString(),
              })}
              <X
                className="size-4 cursor-pointer"
                onClick={() => setSelectedEditionIds([])}
              />
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {selectedEditionIds.length > 0 && (
            <EditionsActionsDropdown
              selectedEditionIds={selectedEditionIds}
              setSelectedEditionIds={setSelectedEditionIds}
              tab={tab}
            />
          )}
          <CreateEditionDialog bookId={bookId} />
        </div>
      </div>

      <div className="mt-4 rounded-md border p-4">
        <EditionsTabs setTab={setTab} tab={tab} />
        <div className="mt-4 grid w-full">
          <div className="overflow-x-auto rounded-md">
            <Table className="overflow-hidden">
              <TableHeader className="">
                <TableRow className="">
                  <TableHead></TableHead>
                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Edition id")}</div>
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
                  <TableHead className="text-nowrap font-bold">ISBN</TableHead>

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
                      {t("Language")}
                    </div>
                  </TableHead>

                  <TableHead>
                    <div className="flex justify-center text-nowrap font-bold">
                      {t("Shelf")}
                    </div>
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    {t("Publisher")}
                  </TableHead>
                  <TableHead>
                    <div className="flex justify-center text-nowrap font-bold">
                      {t("Format")}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex justify-center text-nowrap font-bold">
                      {t("Status")}
                    </div>
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Actions")}</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEditions.map((edition) => (
                  <TableRow key={edition.bookEditionId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedEditionIds.includes(
                          edition.bookEditionId
                        )}
                        onCheckedChange={() => {
                          if (
                            selectedEditionIds.includes(edition.bookEditionId)
                          ) {
                            setSelectedEditionIds((prev) =>
                              prev.filter((id) => id !== edition.bookEditionId)
                            )
                          } else {
                            setSelectedEditionIds((prev) => [
                              ...prev,
                              edition.bookEditionId,
                            ])
                          }
                        }}
                      />
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
                        {edition.language || "-"}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center pr-4">
                        {edition.shelf?.shelfNumber ? (
                          <ShelfBadge shelfNumber={edition.shelf.shelfNumber} />
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {edition.publisher || "-"}
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
                    <TableCell>
                      <div className="flex justify-center">
                        <BookEditionStatusBadge status={edition.status} />
                      </div>
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
      </div>
    </TabsContent>
  )
}

export default EditionsTabsContent
