"use client"

import React, { useEffect, useState } from "react"
import { format } from "date-fns"
import { CheckSquare, Search, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import Barcode from "react-barcode"

import { EBookCopyStatus } from "@/lib/types/enums"
import {
  type Condition,
  type ConditionHistory,
  type LibraryItemInstance,
} from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import NoData from "@/components/ui/no-data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import BookCopyStatusBadge from "@/components/badges/book-copy-status-badge"
import CirculatedBadge from "@/components/badges/circulated-badge"

// import AddCopiesDialog from "./add-copies-dialog"
import CopiesActionsDropdown from "./copies-actions-dropdown"
import CopiesTabs from "./copies-tabs"
import CopyDropdown from "./copy-dropdown"

type Props = {
  copies: (LibraryItemInstance & {
    libraryItemConditionHistories: (ConditionHistory & {
      condition: Condition
    })[]
  })[]
  bookId: number
  prefix: string
}

function CopiesTabsContent({ copies, bookId, prefix }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCopyIds, setSelectedCopyIds] = useState<number[]>([])
  const [tab, setTab] = useState<"Active" | "Deleted">("Active")

  const filteredCopies = copies.filter(
    (copy) => copy.isDeleted === (tab === "Deleted")
  )

  useEffect(() => {
    setSelectedCopyIds([])
  }, [tab])

  return (
    <TabsContent value="copies">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div
            className={cn(
              "flex max-w-md flex-1 items-center rounded-md border-2 px-2"
            )}
          >
            {/* //TODO: search */}
            <Search className="size-6" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
              placeholder={locale === "vi" ? "Tìm kiếm..." : "Search..."}
            />
          </div>
          {selectedCopyIds.length > 0 && (
            <div className="flex h-10 items-center justify-center gap-x-2 rounded-md bg-primary px-2 py-1 text-sm text-primary-foreground">
              <CheckSquare className="size-4" />
              {t("copies selected", {
                amount: selectedCopyIds.length.toString(),
              })}
              <X
                className="size-4 cursor-pointer"
                onClick={() => setSelectedCopyIds([])}
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {selectedCopyIds.length > 0 && (
            <CopiesActionsDropdown
              tab={tab}
              bookId={bookId}
              selectedCopyIds={selectedCopyIds}
              setSelectedCopyIds={setSelectedCopyIds}
              copies={copies}
            />
          )}
          {/* <AddCopiesDialog bookId={bookId} prefix={prefix} /> */}
        </div>
      </div>
      <div className="mt-4 rounded-md border p-4">
        <CopiesTabs setTab={setTab} tab={tab} />
        <div className="mt-4 grid w-full">
          <div className="overflow-x-auto rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>

                  <TableHead className="text-nowrap font-bold">
                    {t("Copy code")}
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Barcode")}</div>
                  </TableHead>

                  <TableHead>
                    <div className="flex items-center justify-center text-nowrap font-bold">
                      {t("Available status")}
                    </div>
                  </TableHead>

                  <TableHead>
                    <div className="flex items-center justify-center text-nowrap font-bold">
                      {t("Circulated")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    {t("Created at")}
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    {t("Created by")}
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    {t("Updated at")}
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    {t("Updated by")}
                  </TableHead>

                  {/* <TableHead className="text-nowrap font-bold">
                    {t("Condition status")}
                  </TableHead> */}
                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Actions")}</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCopies.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <div className="flex justify-center p-4">
                        <NoData />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {filteredCopies.map((copy) => (
                  <TableRow key={copy.libraryItemInstanceId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCopyIds.includes(
                          copy.libraryItemInstanceId
                        )}
                        onCheckedChange={() => {
                          if (
                            selectedCopyIds.includes(copy.libraryItemInstanceId)
                          ) {
                            setSelectedCopyIds((prev) =>
                              prev.filter(
                                (id) => id !== copy.libraryItemInstanceId
                              )
                            )
                          } else {
                            setSelectedCopyIds((prev) => [
                              ...prev,
                              copy.libraryItemInstanceId,
                            ])
                          }
                        }}
                      />
                    </TableCell>

                    <TableCell className="text-nowrap">
                      {copy.barcode}
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        <div className="w-fit border">
                          <Barcode
                            value={copy.barcode}
                            height={24}
                            fontSize={16}
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex items-center justify-center">
                        <BookCopyStatusBadge
                          status={
                            copy.isDeleted
                              ? EBookCopyStatus.DELETED
                              : copy.status
                          }
                        />
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        <CirculatedBadge circulated={copy.isCirculated} />
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      {copy.createdAt
                        ? format(new Date(copy.createdAt), "dd-MM-yyyy")
                        : "-"}
                    </TableCell>

                    <TableCell className="text-nowrap">
                      {copy.createdBy || "-"}
                    </TableCell>

                    <TableCell className="text-nowrap">
                      {copy.updatedAt
                        ? format(new Date(copy.updatedAt), "dd-MM-yyyy")
                        : "-"}
                    </TableCell>

                    <TableCell className="text-nowrap">
                      {copy.updatedBy || "-"}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center">
                        <CopyDropdown
                          bookId={bookId}
                          copy={copy}
                          prefix={prefix}
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

export default CopiesTabsContent
